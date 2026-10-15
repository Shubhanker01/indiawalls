import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateImageMagicBytes, verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import Client from '@/models/Client.mjs';

export const runtime = 'nodejs';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_EXTENSIONS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'images';

function copyCookies(source, destination) {
    source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
}

function getReply(request) {
    const initialResponse = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyCookies(getResponse(), NextResponse.json(body, { status }));
    return { supabase, reply };
}

async function authorize(supabase, reply) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return reply({ error: 'Authentication is required.' }, 401);
    }
    if (!verifyAdminRole(user)) {
        return reply({ error: 'Forbidden: Admin role required.' }, 403);
    }

    const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
        console.error('Failed to verify MFA level:', assuranceError);
        return reply({ error: 'Could not verify authentication level.' }, 500);
    }
    if (assurance?.currentLevel !== 'aal2') {
        return reply({ error: 'MFA verification required (AAL2).' }, 403);
    }
    return null;
}

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
}

export async function POST(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    let formData;
    try {
        formData = await request.formData();
    } catch {
        return reply({ error: 'Invalid form data.' }, 400);
    }

    const nameValue = formData.get('name');
    const name = typeof nameValue === 'string' ? nameValue.trim() : '';
    const logo = formData.get('logo');
    if (!name || name.length > 160 || !(logo instanceof File)) {
        return reply({ error: 'A client name and logo image are required.' }, 400);
    }
    if (!IMAGE_EXTENSIONS[logo.type]) {
        return reply({ error: 'Only JPG, PNG, or WebP logos are allowed.' }, 400);
    }
    if (logo.size === 0 || logo.size > MAX_IMAGE_BYTES) {
        return reply({ error: 'The client logo must be between 1 byte and 4 MB.' }, 413);
    }

    const imageBuffer = Buffer.from(await logo.arrayBuffer());
    if (!validateImageMagicBytes(imageBuffer, logo.type)) {
        return reply({ error: 'The uploaded logo failed file signature verification.' }, 400);
    }

    const slugBase = slugify(name);
    if (!slugBase) {
        return reply({ error: 'Client name must contain at least one letter or number.' }, 400);
    }

    let uploadedPath;
    try {
        await dbConnect();

        uploadedPath = `clients/${randomUUID()}.${IMAGE_EXTENSIONS[logo.type]}`;
        const { error: uploadError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(uploadedPath, imageBuffer, {
                contentType: logo.type,
                cacheControl: '31536000',
                upsert: false,
            });
        if (uploadError) {
            console.error('Client logo upload failed:', uploadError.message);
            return reply({ error: 'Client logo upload failed.' }, 500);
        }

        const { data: publicLogo } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(uploadedPath);
        if (!publicLogo?.publicUrl) {
            throw new Error('Could not create a public URL for the uploaded client logo.');
        }

        const order = (await Client.countDocuments({})) + 1;
        const client = await Client.create({
            name,
            slug: `${slugBase}-${randomUUID().slice(0, 8)}`,
            logo: publicLogo.publicUrl,
            order,
            published: true,
        });
        uploadedPath = undefined;

        revalidatePath('/');
        return reply(
            {
                ok: true,
                client: {
                    id: client._id.toString(),
                    name: client.name,
                    slug: client.slug,
                    logo: client.logo,
                },
            },
            201
        );
    } catch (error) {
        if (uploadedPath) {
            const { error: cleanupError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .remove([uploadedPath]);
            if (cleanupError) {
                console.error('Failed to clean up client logo:', cleanupError.message);
            }
        }

        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        console.error('Failed to create client:', error);
        return reply({ error: 'Failed to create client.' }, 500);
    }
}

export async function DELETE(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    let body;
    try {
        body = await request.json();
    } catch {
        return reply({ error: 'Invalid request body.' }, 400);
    }

    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    if (!name || name.length > 160) {
        return reply({ error: 'A client name is required.' }, 400);
    }

    try {
        await dbConnect();
        const client = await Client.findOneAndDelete({ name })
            .select('name logo')
            .lean();

        if (!client) {
            return reply({ error: 'Client not found.' }, 404);
        }

        revalidatePath('/');

        const storagePathMatch = client.logo.match(
            /\/storage\/v1\/object\/public\/[^/]+\/(clients\/[a-f0-9-]+\.(?:jpg|png|webp))$/i
        );
        if (storagePathMatch) {
            const { error: storageError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .remove([storagePathMatch[1]]);
            if (storageError) {
                console.error('Deleted client logo cleanup failed:', storageError.message);
                return reply(
                    {
                        error: 'Client was deleted, but its stored logo could not be removed.',
                        clientDeleted: true,
                    },
                    500
                );
            }
        }

        return reply({ ok: true, client: { name: client.name } });
    } catch (error) {
        console.error('Failed to delete client:', error);
        return reply({ error: 'Failed to delete client.' }, 500);
    }
}
