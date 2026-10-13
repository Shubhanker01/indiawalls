import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublishedBlogs } from '@/lib/content';
import { Clock, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
    title: 'Industry Insights & Technical Guides | Rajasthanwalls Infratech',
    description:
        'Explore expert guides, cost comparisons, and engineering insights on precast RCC boundary walls, compound wall systems, and paver block installations.',
};

export const dynamic = 'force-dynamic';

export default async function BlogIndexPage() {
    const blogPosts = await getPublishedBlogs();
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
            <div>
                <Navbar />

                {/* Hero Header */}
                <header className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-16 text-center sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                            <BookOpen className="w-3.5 h-3.5" />
                            Knowledge Base & Case Studies
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
                            Construction Insights & Guides
                        </h1>
                        <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
                            Practical benchmarks, technical comparisons, and project guides for industrial plot developers, solar farm EPCs, and contractors across Delhi NCR and Rajasthan.
                        </p>
                    </div>
                </header>

                {/* Articles Grid */}
                <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.slug}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-900/10"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-52 w-full overflow-hidden bg-slate-800">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="rounded-full bg-slate-950/80 backdrop-blur px-3 py-1 text-xs font-medium text-yellow-400 border border-yellow-500/30">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                {post.readTime}
                                            </span>
                                        </div>

                                        <h2 className="text-lg font-bold text-white transition group-hover:text-yellow-400 line-clamp-2">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <User className="w-3.5 h-3.5 text-slate-500" />
                                            {post.author}
                                        </span>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition"
                                        >
                                            Read More
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

