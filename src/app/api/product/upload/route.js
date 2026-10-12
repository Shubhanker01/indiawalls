import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import dbConnect from '@/lib/dbConnect';
import Project from '@/models/Project.mjs';

export const runtime = 'nodejs';

const MAX_BYTES = 4 * 1024 * 1024;
const EXT_BY_TYPE = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const BUCKET = process.env.SUPABASE_BUCKET || 'images';
const FOLDER = 'projects';

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
});

const slugify = (s) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60);

export async function POST(request) {
    const response = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response });

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
    }

    // Optional hardening: require the MFA-verified session (aal2) like your admin pages do.
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel !== 'aal2') return NextResponse.json({ error: 'MFA required.' }, { status: 403 });

    let formData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 });
    }

    const title = formData.get('title')?.toString().trim();
    const type = formData.get('type')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const description = formData.get('description')?.toString().trim();
    const image = formData.get('image');

    if (!title || !type || !location || !description || !(image instanceof File)) {
        return NextResponse.json(
            { error: 'Title, type, location, description, and an image are required.' },
            { status: 400 }
        );
    }

    const ext = EXT_BY_TYPE[image.type];
    if (!ext) {
        return NextResponse.json({ error: 'Only JPG, PNG or WebP images are allowed.' }, { status: 400 });
    }
    if (image.size > MAX_BYTES) {
        return NextResponse.json({ error: 'Image must be 4 MB or smaller.' }, { status: 413 });
    }

    // 1) Upload to Supabase Storage
    const imagePath = `${FOLDER}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(imagePath, Buffer.from(await image.arrayBuffer()), {
            contentType: image.type,
            cacheControl: '31536000',
            upsert: false,
        });

    if (uploadError) {
        console.error('Storage upload failed:', uploadError.message);
        return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
    }

    // 2) Save the record in MongoDB (replaces uploads.json)
    let project;
    try {
        await dbConnect();
        project = await Project.create({
            title,
            slug: `${slugify(title)}-${randomUUID().slice(0, 6)}`,
            category: type,
            location,
            description,
            image: imagePath, // path only; lib code prefixes NEXT_PUBLIC_IMAGES
            order: 0,
            published: true,
        });
    } catch (err) {
        console.error('Saving project failed:', err.message);
        await supabaseAdmin.storage.from(BUCKET).remove([imagePath]).catch(() => { }); // don't leave an orphan file
        return NextResponse.json({ error: 'Project data could not be saved.' }, { status: 500 });
    }

    const { data: pub } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(imagePath);

    const resultResponse = NextResponse.json(
        {
            ok: true,
            upload: {
                id: project._id.toString(),
                slug: project.slug,
                title,
                type,
                location,
                description,
                imageName: image.name,
                imageUrl: pub.publicUrl,
                createdBy: user.id,
                createdAt: project.createdAt,
            },
        },
        { status: 201 }
    );
    getResponse().cookies.getAll().forEach((cookie) => resultResponse.cookies.set(cookie));

    return resultResponse;
}