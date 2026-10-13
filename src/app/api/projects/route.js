import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { validateImageMagicBytes, verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // GET search results must never be cached

function copyAuthCookies(source, destination) {
    source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
    return destination;
}

// Same checks as DELETE (logged in + MFA level aal2 + admin role), shared by GET and PATCH.
// Returns { deny } (a ready response) when blocked, otherwise { reply } which builds
// JSON responses that carry the refreshed auth cookies.
async function requireAdmin(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });
    const reply = (body, status = 200) => copyAuthCookies(getResponse(), NextResponse.json(body, { status }));

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return { deny: reply({ error: 'Authentication is required.' }, 401) };

    if (!verifyAdminRole(user)) {
        return { deny: reply({ error: 'Forbidden: Admin role required.' }, 403) };
    }

    const { data: assurance, error: assuranceError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
        console.error('Failed to verify MFA level:', assuranceError);
        return { deny: reply({ error: 'Could not verify authentication level.' }, 500) };
    }
    if (assurance?.currentLevel !== 'aal2') return { deny: reply({ error: 'MFA required.' }, 403) };

    return { reply };
}

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // typed text must not act as a regex
const MAX_GALLERY_IMAGE_BYTES = 4 * 1024 * 1024;
const GALLERY_IMAGE_EXTENSIONS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
};
const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'images';

// ---------------------------------------------------------------------------
// GET /api/projects?q=wall -> project fields used by the admin update form.
// Used by the search box: returns up to 8 projects whose title matches.
// ---------------------------------------------------------------------------
export async function GET(request) {
    const { deny, reply } = await requireAdmin(request);
    if (deny) return deny;

    try {
        const q = (request.nextUrl.searchParams.get('q') || '').trim().slice(0, 80);
        if (!q) return reply({ results: [] });

        await dbConnect();
        // Unpublished projects are included on purpose: the admin must be able to edit them too.
        const docs = await Project.find({ title: { $regex: escapeRegex(q), $options: 'i' } })
            .select('title category location description image gallery')
            .sort({ title: 1 })
            .limit(8)
            .lean();

        return reply({
            results: docs.map((d) => ({
                title: d.title,
                category: d.category,
                location: d.location,
                description: d.description || '',
                image: d.image,
                gallery: d.gallery || [],
            })),
        });
    } catch (error) {
        console.error('Failed to search projects:', error);
        return reply({ error: 'Failed to search projects.' }, 500);
    }
}

// ---------------------------------------------------------------------------
// PATCH /api/projects body: { currentTitle, title, category, location, description, image, gallery }
// The unique currentTitle identifies the project; slug is left unchanged so existing links keep working.
// ---------------------------------------------------------------------------
export async function PATCH(request) {
    const { deny, reply } = await requireAdmin(request);
    if (deny) return deny;

    const uploadedPaths = [];
    const cleanupUploads = async () => {
        if (uploadedPaths.length === 0) return;
        try {
            const { error } = await getSupabaseAdmin().storage.from(STORAGE_BUCKET).remove(uploadedPaths);
            if (error) console.error('Gallery upload cleanup failed:', error.message);
        } catch (error) {
            console.error('Gallery upload cleanup failed:', error.message);
        }
    };

    try {
        let body;
        let galleryFiles = [];
        try {
            if (request.headers.get('content-type')?.includes('multipart/form-data')) {
                const formData = await request.formData();
                body = JSON.parse(formData.get('project')?.toString() || '');
                galleryFiles = formData.getAll('galleryFiles');
            } else {
                body = await request.json();
            }
        } catch {
            return reply({ error: 'Invalid request body.' }, 400);
        }

        const str = (v) => (typeof v === 'string' ? v.trim() : '');
        const currentTitle = str(body?.currentTitle);
        const title = str(body?.title);
        const category = str(body?.category);
        const location = str(body?.location);
        const description = str(body?.description);
        const image = str(body?.image);
        const gallery = body?.gallery ?? [];

        if (!currentTitle) return reply({ error: 'The current project title is required.' }, 400);
        if (!title || !category || !location || !description || !image) {
            return reply({ error: 'Title, category, location, description and image are required.' }, 400);
        }
        if (
            !Array.isArray(gallery) ||
            gallery.some(
                (item) =>
                    !item ||
                    typeof item !== 'object' ||
                    typeof item.src !== 'string' ||
                    !item.src.trim() ||
                    (item.alt !== undefined && typeof item.alt !== 'string') ||
                    (item.caption !== undefined && typeof item.caption !== 'string')
            )
        ) {
            return reply({ error: 'Gallery must be an array of images with a source.' }, 400);
        }
        if (
            galleryFiles.some(
                (file) =>
                    !(file instanceof File) ||
                    !GALLERY_IMAGE_EXTENSIONS[file.type] ||
                    file.size > MAX_GALLERY_IMAGE_BYTES
            )
        ) {
            return reply(
                { error: 'Gallery images must be JPG, PNG or WebP files no larger than 4 MB each.' },
                400
            );
        }

        const imageBuffers = [];
        for (const file of galleryFiles) {
            const buffer = Buffer.from(await file.arrayBuffer());
            if (!validateImageMagicBytes(buffer, file.type)) {
                return reply({ error: `Gallery image "${file.name}" is not a valid image file.` }, 400);
            }
            imageBuffers.push({ file, buffer });
        }

        await dbConnect();
        for (const [index, { file, buffer }] of imageBuffers.entries()) {
            const storagePath = `projects/${randomUUID()}.${GALLERY_IMAGE_EXTENSIONS[file.type]}`;
            const { error: uploadError } = await getSupabaseAdmin().storage
                .from(STORAGE_BUCKET)
                .upload(storagePath, buffer, {
                    contentType: file.type,
                    cacheControl: '31536000',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Gallery image upload failed:', uploadError.message);
                await cleanupUploads();
                return reply({ error: 'Gallery image upload failed.' }, 500);
            }

            uploadedPaths.push(storagePath);
            gallery.push({ src: storagePath, alt: `${title} gallery image ${index + 1}` });
        }

        const project = await Project.findOneAndUpdate(
            { title: currentTitle },
            {
                $set: {
                    title,
                    category,
                    location,
                    description,
                    image,
                    gallery: gallery.map((item) => ({
                        src: item.src.trim(),
                        alt: str(item.alt),
                        ...(item.caption === undefined ? {} : { caption: str(item.caption) }),
                    })),
                },
            },
            { new: true, runValidators: true }
        ).lean();

        if (!project) {
            await cleanupUploads();
            return reply({ error: 'Project not found.' }, 404);
        }
        uploadedPaths.length = 0;

        // Clear the cached pages so the edit shows up straight away
        revalidatePath('/projects');
        revalidatePath(`/projects/${project.slug}`);

        return reply({
            ok: true,
            project: {
                title: project.title,
                category: project.category,
                location: project.location,
                description: project.description,
                image: project.image,
                gallery: project.gallery,
            },
        });
    } catch (error) {
        await cleanupUploads();
        console.error('Failed to update project:', error);
        return reply({ error: 'Failed to update project.' }, 500);
    }
}

export async function DELETE(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    try {
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'Authentication is required.' }, { status: 401 })
            );
        }

        if (!verifyAdminRole(user)) {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'Forbidden: Admin role required.' }, { status: 403 })
            );
        }

        const { data: assurance, error: assuranceError } =
            await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (assuranceError) {
            console.error('Failed to verify MFA level:', assuranceError);
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'Could not verify authentication level.' }, { status: 500 })
            );
        }
        if (assurance?.currentLevel !== 'aal2') {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'MFA required.' }, { status: 403 })
            );
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
            );
        }

        const title = typeof body?.title === 'string' ? body.title.trim() : '';
        if (!title) {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'A project title is required.' }, { status: 400 })
            );
        }

        await dbConnect();
        const project = await Project.findOneAndDelete({ title }).select('title').lean();
        if (!project) {
            return copyAuthCookies(
                getResponse(),
                NextResponse.json({ error: 'Project not found.' }, { status: 404 })
            );
        }

        return copyAuthCookies(
            getResponse(),
            NextResponse.json({ ok: true, project: { title: project.title } })
        );
    } catch (error) {
        console.error('Failed to delete project:', error);
        return copyAuthCookies(
            getResponse(),
            NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 })
        );
    }
}