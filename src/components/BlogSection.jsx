import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

export const blogPosts = [
    {
        id: 1,
        title: 'Precast Concrete vs. Traditional Brick Boundary Walls: Cost & Speed Comparison',
        excerpt:
            'Discover why industrial park developers in Rajasthan and NCR are switching to precast RCC walls to cut installation timelines by 50% and lower overall project budgets.',
        category: 'Industry Insights',
        date: 'May 12, 2026',
        readTime: '4 min read',
        image: '/images/blogs/Best-Boundary-Wall-Solutions-for-Solar-Plants-and-Industrial-Projects.png',
        slug: 'precast-vs-brick-boundary-wall-comparison',
    },
    {
        id: 2,
        title: 'How High-Tensile Prestressed Steel Strands Increase Boundary Wall Durability',
        excerpt:
            'Learn about the structural engineering behind prestressed RCC panels and why high-density concrete resists monsoon weathering, cracking, and severe impact.',
        category: 'Engineering',
        date: 'Apr 28, 2026',
        readTime: '6 min read',
        image: '/images/blogs/How-Precast-Walls-Save-Time-and-Add-Strength.png',
        slug: 'how-precast-walls-build-faster-and-stronger',
    },
    {
        id: 3,
        title: 'Which Interlocking Paver Blocks Last the Longest?',
        excerpt:
            'Step-by-step checklist for civil contractors: soil excavation, post-hole alignment, and foundation grouting required before erecting precast RCC posts.',
        category: 'Installation Guide',
        date: 'Mar 15, 2026',
        readTime: '5 min read',
        image: '/images/blogs/Which-Interlocking-Paver-Blocks-Last-the-Longest-3.png.bv.webp',
        slug: 'interlocking-paver-block-manufacturer-alwar-rajasthan',
    },
];

export default function BlogSection() {
    return (
        <section className="py-20 bg-white border-b border-slate-200" id="blog">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div className="max-w-xl space-y-3">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                            Knowledge Hub
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                            Latest Articles & Technical Insights
                        </h2>
                        <p className="text-slate-700 text-sm sm:text-base">
                            Expert advice on precast manufacturing, boundary wall installation standards, and industrial site security.
                        </p>
                    </div>

                    <Link
                        href="#all-articles"
                        className="inline-flex items-center space-x-2 text-sm font-bold text-amber-700 hover:text-amber-800 transition group"
                    >
                        <span>View All Insights</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </AnimatedSection>

                {/* BLOG CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <AnimatedSection
                            key={post.id}
                            delay={0.15 + (post.id - 1) * 0.08}
                            className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                {/* CARD IMAGE CONTAINER */}
                                <div className="relative w-full h-48 sm:h-52 bg-slate-200 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className=" group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* CARD CONTENT */}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <span>{post.readTime}</span>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-amber-700 transition">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>

                                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>

                            {/* CARD FOOTER */}
                            <div className="px-6 pb-6 pt-2">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-xs font-bold text-slate-900 hover:text-amber-700 transition space-x-1"
                                >
                                    <span>Read Article</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}