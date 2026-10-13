import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product.mjs';
import Project from '@/models/Project.mjs';
import BlogPost from '@/models/BlogPost.mjs';

export default async function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajasthanwalls.in';

    // 1. Core static routes
    const staticRoutes = [
        { path: '', changeFrequency: 'weekly', priority: 1.0 },
        { path: '/products', changeFrequency: 'weekly', priority: 0.9 },
        { path: '/specifications', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/why-us', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/projects', changeFrequency: 'weekly', priority: 0.85 },
        { path: '/blog', changeFrequency: 'weekly', priority: 0.85 },
        { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    ].map(({ path, changeFrequency, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }));

    // 2. Dynamic Product routes fetched from MongoDB
    let productRoutes = [];
    try {
        await dbConnect();
        const products = await Product.find({ published: true }).select('slug updatedAt').lean();

        if (products.length > 0) {
            productRoutes = products.map((item) => ({
                url: `${baseUrl}/products/${item.slug}`,
                lastModified: item.updatedAt || new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            }));
        } else {
            // Safe fallback to canonical product slugs
            const fallbackSlugs = ['boundary-walls', 'paver-solutions', 'fencing-solutions', 'landscaping'];
            productRoutes = fallbackSlugs.map((slug) => ({
                url: `${baseUrl}/products/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            }));
        }
    } catch (err) {
        console.error('Failed to query products for sitemap:', err.message);
        const fallbackSlugs = ['boundary-walls', 'paver-solutions', 'fencing-solutions', 'landscaping'];
        productRoutes = fallbackSlugs.map((slug) => ({
            url: `${baseUrl}/products/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        }));
    }

    // 3. Dynamic Project routes
    let projectRoutes = [];
    try {
        const projects = await Project.find({ published: true, slug: { $exists: true, $ne: '' } })
            .select('slug updatedAt')
            .lean();

        projectRoutes = projects.map((item) => ({
            url: `${baseUrl}/projects/${item.slug}`,
            lastModified: item.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.75,
        }));
    } catch (err) {
        console.error('Failed to query projects for sitemap:', err.message);
    }

    // 4. Dynamic, published Blog Post routes
    let blogRoutes = [];
    try {
        const posts = await BlogPost.find({ published: true }).select('slug updatedAt').lean();
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));
    } catch (err) {
        console.error('Failed to query blog posts for sitemap:', err.message);
    }

    return [...staticRoutes, ...productRoutes, ...projectRoutes, ...blogRoutes];
}
