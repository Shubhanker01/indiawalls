export default async function sitemap() {
    const baseUrl = 'https://indiawalls.in';

    // Static site routes
    const routes = ['', '/about', '/products', '/why-us', '/contact'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Product URLs
    const products = ['precast-walls', 'paver-blocks', 'fencing-poles', 'designer-walls'];
    const productRoutes = products.map((slug) => ({
        url: `${baseUrl}/products/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    return [...routes, ...productRoutes];
}