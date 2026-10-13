import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost.mjs';
import Testimonial from '@/models/Testimonial.mjs';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

export async function getPublishedBlogs(limit) {
    await dbConnect();
    let query = BlogPost.find({ published: true }).sort({ publishedAt: -1 });
    if (limit) query = query.limit(limit);
    return (await query.lean()).map((post) => ({
        ...post,
        content: sanitizeHtml(post.content),
        _id: post._id.toString(),
        publishedAt: post.publishedAt?.toISOString() || null,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        image: post.coverImage || '/images/blogs/Best-Boundary-Wall-Solutions-for-Solar-Plants-and-Industrial-Projects.png',
    }));
}

export async function getPublishedBlogBySlug(slug) {
    await dbConnect();
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    return post ? {
        ...post,
        content: sanitizeHtml(post.content),
        _id: post._id.toString(),
        publishedAt: post.publishedAt?.toISOString() || null,
        date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        image: post.coverImage || '/images/blogs/Best-Boundary-Wall-Solutions-for-Solar-Plants-and-Industrial-Projects.png',
    } : null;
}

export async function getPublishedTestimonials() {
    await dbConnect();
    return (await Testimonial.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean())
        .map((item) => ({ ...item, _id: item._id.toString() }));
}
