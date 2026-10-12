import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getProjectBySlug } from '@/lib/api/getProjects';

export default async function ProjectDetailsPage({ params }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-slate-100 text-slate-800">
            <Navbar />
            <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back to projects
                </Link>

                <div className="mt-8 overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="max-h-[70vh] w-full object-cover"
                    />
                    <div className="p-6 text-white sm:p-10">
                        <span className="inline-block rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900">
                            {project.category}
                        </span>
                        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{project.title}</h1>
                        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-300">
                            <MapPin size={17} className="text-yellow-400" aria-hidden="true" />
                            {project.location}
                        </p>
                        {project.description && (
                            <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-300 sm:text-lg">
                                {project.description}
                            </p>
                        )}

                        {project.gallery.length > 0 && (
                            <div className="mt-10 grid gap-4 sm:grid-cols-2">
                                {project.gallery.map((image, index) => (
                                    <img
                                        key={`${image.src}-${index}`}
                                        src={image.src}
                                        alt={image.alt || `${project.title} photo ${index + 1}`}
                                        loading="lazy"
                                        className="aspect-[4/3] w-full rounded-xl object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </main>
    );
}