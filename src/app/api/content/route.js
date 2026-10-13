import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { verifyAdminRole } from '@/lib/security/rbac';
import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost.mjs';
import Testimonial from '@/models/Testimonial.mjs';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
    try {
        const body = await request.json();
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
            values = {
                title, slug, excerpt, content,
                category: text(body.category, 80) || 'Industry Insights',
                readTime: text(body.readTime, 40) || '4 min read',
                coverImage: text(body.coverImage, 1000),
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
        const item = body.id
            ? await Model.findByIdAndUpdate(body.id, { $set: values }, { new: true, runValidators: true })
            : await Model.create(values);
        if (body.id && !item) return reply({ error: 'Content entry not found.' }, 404);
        revalidatePath('/');
        revalidatePath('/blog');
        if (body.type === 'blog') revalidatePath(`/blog/${item.slug}`);
        return reply({ item: item.toObject() }, body.id ? 200 : 201);
    } catch (error) {
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
