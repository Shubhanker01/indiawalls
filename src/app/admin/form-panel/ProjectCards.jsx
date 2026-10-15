'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Images, MapPin, RefreshCw } from 'lucide-react';

function imageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path) || path.startsWith('/images/')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGES?.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export default function ProjectCards() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProjects = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { data } = await axios.get('/api/projects');
            setProjects(data.results);
        } catch (requestError) {
            setError(requestError.response?.data?.error || 'Could not load projects.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        axios.get('/api/projects', { signal: controller.signal })
            .then(({ data }) => setProjects(data.results))
            .catch((requestError) => {
                if (requestError.name !== 'CanceledError') {
                    setError(requestError.response?.data?.error || 'Could not load projects.');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoading(false);
            });

        return () => controller.abort();
    }, []);

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-slate-100">Project items</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {projects.length} {projects.length === 1 ? 'project' : 'projects'} in the catalog
                    </p>
                </div>
                <button
                    type="button"
                    onClick={loadProjects}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-yellow-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
                    Refresh
                </button>
            </div>

            {error && (
                <p className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}

            {isLoading ? (
                <p className="py-8 text-center text-sm text-slate-400" role="status">
                    Loading projects...
                </p>
            ) : projects.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                    No projects have been added yet.
                </p>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <li
                            key={project.slug || project.title}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                        >
                            <div className="relative aspect-[4/3] bg-slate-800">
                                {project.image ? (
                                    <img
                                        src={imageUrl(project.image)}
                                        alt={project.title}
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        No project image
                                    </div>
                                )}
                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                                        project.published
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-slate-700/90 text-slate-200'
                                    }`}
                                >
                                    {project.published ? 'Published' : 'Unpublished'}
                                </span>
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                                    {project.category || 'Uncategorized'}
                                </p>
                                <h3 className="mt-2 text-lg font-semibold text-white">{project.title}</h3>
                                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
                                    <MapPin size={15} className="shrink-0 text-yellow-400" aria-hidden="true" />
                                    {project.location || 'Location not set'}
                                </p>
                                {project.description && (
                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                                        {project.description}
                                    </p>
                                )}
                                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
                                    <span>Display order: {project.order ?? 0}</span>
                                    {project.gallery?.length > 0 && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <Images size={14} aria-hidden="true" />
                                            {project.gallery.length} {project.gallery.length === 1 ? 'photo' : 'photos'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
