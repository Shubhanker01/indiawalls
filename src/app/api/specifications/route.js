import { apiResponse } from '@/lib/api/response';
import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateImageMagicBytes, verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import Specification from '@/models/Specification.mjs';

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
    const initialResponse = apiResponse({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({
        request,
        response: initialResponse,
    });
    const reply = (body, status = 200) =>
        copyCookies(getResponse(), apiResponse(body, { status }));
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

    let body;
    try {
        const payload = formData.get('payload');
        if (typeof payload !== 'string') throw new Error('Specification data is required.');
        body = JSON.parse(payload);
    } catch (error) {
        return reply({ error: error instanceof SyntaxError ? 'Specification data must be valid JSON.' : error.message }, 400);
    }

    const specificationName =
        typeof body?.specificationName === 'string' ? body.specificationName.trim() : '';
    const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : '';
    const label = typeof body?.label === 'string' ? body.label.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const image = formData.get('image');
    const published = body?.published === undefined ? true : body.published;
    const specifications = body?.specifications;

    if (!specificationName || !slug || !label || !description || !(image instanceof File)) {
        return reply(
            { error: 'Specification name, slug, label, description, and an image file are required.' },
            400
        );
    }
    if (
        specificationName.length > 160 ||
        slug.length > 100 ||
        label.length > 160 ||
        description.length > 5000
    ) {
        return reply({ error: 'One or more fields exceed the allowed length.' }, 400);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return reply({ error: 'Slug may only contain lowercase letters, numbers, and hyphens.' }, 400);
    }
    if (typeof published !== 'boolean') {
        return reply({ error: 'Published must be a boolean.' }, 400);
    }
    if (!IMAGE_EXTENSIONS[image.type]) {
        return reply({ error: 'Only JPG, PNG, or WebP images are allowed.' }, 400);
    }
    if (image.size === 0 || image.size > MAX_IMAGE_BYTES) {
        return reply({ error: 'The specification image must be between 1 byte and 4 MB.' }, 413);
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    if (!validateImageMagicBytes(imageBuffer, image.type)) {
        return reply({ error: 'The uploaded image failed file signature verification.' }, 400);
    }
    if (!Array.isArray(specifications) || specifications.length > 100) {
        return reply({ error: 'Specifications must be a list of no more than 100 rows.' }, 400);
    }

    const specificationRows = [];
    for (const row of specifications) {
        const rowLabel = typeof row?.label === 'string' ? row.label.trim() : '';
        const value = typeof row?.value === 'string' ? row.value.trim() : '';
        if (!rowLabel || !value || rowLabel.length > 160 || value.length > 500) {
            return reply({ error: 'Each specification row needs a label and value within the allowed length.' }, 400);
        }
        specificationRows.push({ label: rowLabel, value });
    }

    let uploadedPath;
    try {
        await dbConnect();
        uploadedPath = `specifications/${randomUUID()}.${IMAGE_EXTENSIONS[image.type]}`;
        const { error: uploadError } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(uploadedPath, imageBuffer, {
                contentType: image.type,
                cacheControl: '31536000',
                upsert: false,
            });
        if (uploadError) {
            console.error('Specification image upload failed:', uploadError.message);
            return reply({ error: 'Specification image upload failed.' }, 500);
        }

        const { data: publicImage } = supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(uploadedPath);
        if (!publicImage?.publicUrl) {
            throw new Error('Could not create a public URL for the uploaded specification image.');
        }

        const specification = await Specification.create({
            specificationName,
            slug,
            label,
            description,
            image: publicImage.publicUrl,
            specifications: specificationRows,
            published,
        });
        uploadedPath = undefined;
        revalidatePath('/specifications');
        return reply(
            {
                ok: true,
                specification: {
                    id: specification._id.toString(),
                    specificationName: specification.specificationName,
                    slug: specification.slug,
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
                console.error('Failed to clean up specification image:', cleanupError.message);
            }
        }
        if (error?.code === 11000) {
            return reply({ error: 'That specification slug is already in use.' }, 409);
        }
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        console.error('Failed to create specification:', error);
        return reply({ error: 'Failed to create specification.' }, 500);
    }
}

export async function GET(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    try {
        await dbConnect();
        const specifications = await Specification.find({})
            .sort({ specificationName: 1 })
            .select('specificationName slug label description image specifications published')
            .lean();
        return reply({
            specifications: specifications.map(({ _id, ...specification }) => ({
                ...specification,
                id: String(_id),
            })),
        });
    } catch (error) {
        console.error('Failed to load specifications for admin:', error);
        return reply({ error: 'Failed to load specifications.' }, 500);
    }
}

export async function PUT(request) {
    const { supabase, reply } = getReply(request);
    const denied = await authorize(supabase, reply);
    if (denied) return denied;

    const selectedSlug = request.nextUrl.searchParams.get('slug')?.trim().toLowerCase();
    if (!selectedSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(selectedSlug)) {
        return reply({ error: 'A valid specification slug is required.' }, 400);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return reply({ error: 'Invalid request body.' }, 400);
    }

    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description = typeof body?.description === 'string' ? body.description.trim() : '';
    const label = typeof body?.label === 'string' ? body.label.trim() : '';
    const specifications = body?.specifications;

    if (!title || !description || !label || !Array.isArray(specifications)) {
        return reply({ error: 'Title, description, label, and a specifications array are required.' }, 400);
    }
    if (title.length > 160 || description.length > 5000 || label.length > 160) {
        return reply({ error: 'One or more fields exceed the allowed length.' }, 400);
    }
    if (specifications.length > 100) {
        return reply({ error: 'A maximum of 100 specification rows is allowed.' }, 400);
    }

    const specificationRows = [];
    for (const row of specifications) {
        const rowLabel = typeof row?.label === 'string' ? row.label.trim() : '';
        const value = typeof row?.value === 'string' ? row.value.trim() : '';
        if (!rowLabel || !value || rowLabel.length > 160 || value.length > 500) {
            return reply({ error: 'Each specification row needs a label and value within the allowed length.' }, 400);
        }
        specificationRows.push({ label: rowLabel, value });
    }

    try {
        await dbConnect();
        const specification = await Specification.findOneAndUpdate(
            { slug: selectedSlug },
            {
                $set: {
                    specificationName: title,
                    description,
                    label,
                    specifications: specificationRows,
                },
            },
            { new: true, runValidators: true }
        )
            .select('specificationName slug description label specifications')
            .lean();

        if (!specification) {
            return reply({ error: 'Specification not found.' }, 404);
        }

        revalidatePath('/specifications');
        const { _id, ...updatedSpecification } = specification;
        return reply({
            ok: true,
            specification: {
                ...updatedSpecification,
                id: String(_id),
            },
        });
    } catch (error) {
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return reply({ error: error.message }, 400);
        }
        console.error('Failed to update specification:', error);
        return reply({ error: 'Failed to update specification.' }, 500);
    }
}

export async function DELETE(request) {
    const { supabase, reply } = getReply(request);

    try {
        const denied = await authorize(supabase, reply);
        if (denied) return denied;

        let body;
        try {
            body = await request.json();
        } catch {
            return reply({ error: 'Invalid request body.' }, 400);
        }

        const specificationName =
            typeof body?.specificationName === 'string' ? body.specificationName.trim() : '';
        if (!specificationName) {
            return reply({ error: 'A specification name is required.' }, 400);
        }

        await dbConnect();
        const specification = await Specification.findOneAndDelete({
            specificationName,
        })
            .select('specificationName slug')
            .lean();

        if (!specification) {
            return reply({ error: 'Specification not found.' }, 404);
        }

        revalidatePath('/specifications');
        return reply({
            ok: true,
            specification: {
                specificationName: specification.specificationName,
                slug: specification.slug,
            },
        });
    } catch (error) {
        console.error('Failed to delete specification:', error);
        return reply({ error: 'Failed to delete specification.' }, 500);
    }
}
