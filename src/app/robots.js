export default function robots() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rajasthanwalls.in';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/mfa/'],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}