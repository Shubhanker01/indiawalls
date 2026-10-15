import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateImageMagicBytes, verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost.mjs';
import Testimonial from '@/models/Testimonial.mjs';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

async function authorize(request) {
    const base = NextResponse.json({ ok: true });
    const { supabase, getResponse } = createSupabaseServerClient({ request, response: base });
    const reply = (body, status = 200) => copyCookies(getResponse(), NextResponse.json(body, { status }));
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { deny: reply({ error: 'Authentication is required.' }, 401) };
    if (!verifyAdminRole(user)) return { deny: reply({ error: 'Admin role required.' }, 403) };
    const { data: level, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (mfaError || level?.currentLevel !== 'aal2') return { deny: reply({ error: 'MFA verification is required.' }, 403) };
    return { reply };
}

const modelFor = (type) => type === 'blog' ? BlogPost : type === 'testimonial' ? Testimonial : null;
const text = (value, max = 20000) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const slugify = (value) => text(value, 140).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100);

function getManagedBlogImagePath(imageUrl) {
    if (typeof imageUrl !== 'string' || !imageUrl) return null;
    try {
        const url = new URL(imageUrl);
        const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/blogs/`;
        const markerIndex = url.pathname.indexOf(marker);
        if (markerIndex < 0) return null;
        const path = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
        return path && !path.includes('/') ? `blogs/${path}` : null;
    } catch {
        return null;
    }
}

async function removeManagedBlogImage(imageUrl) {
    const path = getManagedBlogImagePath(imageUrl);
    if (!path) return;
    try {
        const { error } = await supabaseAdmin.storage.from(STORAGE_BUCKET).remove([path]);
        if (error) console.error('Failed to remove blog cover image:', error.message);
    } catch (error) {
        console.error('Failed to remove blog cover image:', error);
    }
}

export async function GET(request) {
    const { deny, reply } = await authorize(request);
    if (deny) return deny;
    const type = request.nextUrl.searchParams.get('type');
    const Model = modelFor(type);
    if (!Model) return reply({ error: 'Choose blog or testimonial content.' }, 400);
    try {
        await dbConnect();
        const items = await Model.find({}).sort(type === 'blog' ? { updatedAt: -1 } : { order: 1, updatedAt: -1 }).lean();
        return reply({ items: items.map((item) => ({ ...item, _id: item._id.toString() })) });
    } catch (error) {
        console.error('Failed to load admin content:', error);
        return reply({ error: 'Failed to load content.' }, 500);
    }
}

export async function POST(request) {
    const { deny, reply } = await authorize(request);
    if (deny) return deny;
    let uploadedPath;
    try {
        let body;
        let image = null;
        if (request.headers.get('content-type')?.includes('multipart/form-data')) {
            let formData;
            try {
                formData = await request.formData();
            } catch {
                return reply({ error: 'Invalid form data.' }, 400);
            }
            const payload = formData.get('payload');
            if (typeof payload !== 'string') return reply({ error: 'Content data is required.' }, 400);
            try {
                body = JSON.parse(payload);
            } catch {
                return reply({ error: 'Content data must be valid JSON.' }, 400);
            }
            const uploadedImage = formData.get('coverImage');
            if (uploadedImage instanceof File && uploadedImage.size > 0) image = uploadedImage;
        } else {
            body = await request.json();
        }
        const Model = modelFor(body?.type);
        if (!Model) return reply({ error: 'Choose blog or testimonial content.' }, 400);
        const published = body.published === true;
        let values;
        if (body.type === 'blog') {
            const title = text(body.title, 180);
            const slug = slugify(body.slug || title);
            const excerpt = text(body.excerpt, 600);
            const content = sanitizeHtml(body.content);
            if (!title || !slug || !excerpt || !content) return reply({ error: 'Title, slug, excerpt and article content are required.' }, 400);
            if (!body.id && !image) return reply({ error: 'A cover image file is required.' }, 400);
            if (image && !IMAGE_EXTENSIONS[image.type]) {
                return reply({ error: 'Only JPG, PNG, or WebP cover images are allowed.' }, 400);
            }
            if (image && (image.size === 0 || image.size > MAX_IMAGE_BYTES)) {
                return reply({ error: 'The blog cover image must be between 1 byte and 4 MB.' }, 413);
            }
            if (image) {
                const imageBuffer = Buffer.from(await image.arrayBuffer());
                if (!validateImageMagicBytes(imageBuffer, image.type)) {
                    return reply({ error: 'The uploaded cover image failed file signature verification.' }, 400);
                }
                await dbConnect();
                uploadedPath = `blogs/${randomUUID()}.${IMAGE_EXTENSIONS[image.type]}`;
                const { error: uploadError } = await supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .upload(uploadedPath, imageBuffer, {
                        contentType: image.type,
                        cacheControl: '31536000',
                        upsert: false,
                    });
                if (uploadError) {
                    console.error('Blog cover image upload failed:', uploadError.message);
                    return reply({ error: 'Blog cover image upload failed.' }, 500);
                }
                const { data: publicImage } = supabaseAdmin.storage
                    .from(STORAGE_BUCKET)
                    .getPublicUrl(uploadedPath);
                if (!publicImage?.publicUrl) {
                    throw new Error('Could not create a public URL for the uploaded blog cover image.');
                }
                values = { coverImage: publicImage.publicUrl };
            } else {
                values = {};
            }
            values = {
                ...values,
                title, slug, excerpt, content,
                category: text(body.category, 80) || 'Industry Insights',
                readTime: text(body.readTime, 40) || '4 min read',
                author: text(body.author, 100) || 'Rajasthanwalls Technical Desk',
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
                published,
            };
            if (Number.isNaN(values.publishedAt.getTime())) return reply({ error: 'Published date is invalid.' }, 400);
        } else {
            const name = text(body.name, 120);
            const quote = text(body.quote, 1200);
            const rating = Number(body.rating || 5);
            if (!name || !quote || !Number.isInteger(rating) || rating < 1 || rating > 5) return reply({ error: 'Name, quote and a rating from 1 to 5 are required.' }, 400);
            values = { name, quote, rating, role: text(body.role, 120), location: text(body.location, 120), avatar: text(body.avatar, 1000), order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0, published };
        }
        await dbConnect();
        const previousItem = body.id ? await Model.findById(body.id).lean() : null;
        if (body.id && !previousItem) return reply({ error: 'Content entry not found.' }, 404);
        const item = body.id
            ? await Model.findByIdAndUpdate(body.id, { $set: values }, { new: true, runValidators: true })
            : await Model.create(values);
        if (uploadedPath) {
            uploadedPath = undefined;
            if (body.type === 'blog' && previousItem?.coverImage) {
                await removeManagedBlogImage(previousItem.coverImage);
            }
        }
        revalidatePath('/');
        revalidatePath('/blog');
        if (body.type === 'blog') revalidatePath(`/blog/${item.slug}`);
        return reply({ item: item.toObject() }, body.id ? 200 : 201);
    } catch (error) {
        if (uploadedPath) {
            const { error: cleanupError } = await supabaseAdmin.storage
                .from(STORAGE_BUCKET)
                .remove([uploadedPath]);
            if (cleanupError) console.error('Failed to clean up blog cover image:', cleanupError.message);
        }
        if (error?.code === 11000) return reply({ error: 'That blog slug is already in use.' }, 409);
        if (error?.name === 'ValidationError' || error?.name === 'CastError') return reply({ error: error.message }, 400);
        console.error('Failed to save admin content:', error);
        return reply({ error: 'Failed to save content.' }, 500);
    }
}

export async function DELETE(request) {
    const { deny, reply } = await authorize(request);
    if (deny) return deny;
    try {
        const body = await request.json();
        const Model = modelFor(body?.type);
        if (!Model || typeof body.id !== 'string') return reply({ error: 'Content type and entry ID are required.' }, 400);
        await dbConnect();
        const item = await Model.findByIdAndDelete(body.id).lean();
        if (!item) return reply({ error: 'Content entry not found.' }, 404);
        if (body.type === 'blog') await removeManagedBlogImage(item.coverImage);
        revalidatePath('/');
        revalidatePath('/blog');
        if (body.type === 'blog') revalidatePath(`/blog/${item.slug}`);
        return reply({ ok: true });
    } catch (error) {
        if (error?.name === 'CastError') return reply({ error: 'Invalid content entry ID.' }, 400);
        console.error('Failed to delete admin content:', error);
        return reply({ error: 'Failed to delete content.' }, 500);
    }
}
