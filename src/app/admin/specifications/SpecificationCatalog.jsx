'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Rows3 } from 'lucide-react';
import { apiGet } from '@/lib/api/client';

export default function SpecificationCatalog() {
    const [specifications, setSpecifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadCatalog() {
            try {
                const data = await apiGet('/api/specifications');
                if (isMounted) setSpecifications(data.specifications);
            } catch (requestError) {
                if (isMounted) {
                    setError(requestError.message || 'Could not load the specifications catalog.');
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadCatalog();
        return () => {
            isMounted = false;
        };
    }, [refreshCount]);

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-white">Specifications catalog</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {specifications.length}{' '}
                        {specifications.length === 1 ? 'specification group' : 'specification groups'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setError('');
                        setIsLoading(true);
                        setRefreshCount((count) => count + 1);
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-yellow-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                        aria-hidden="true"
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <p
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {isLoading ? (
                <div
                    className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400"
                    role="status"
                >
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Loading specifications...
                </div>
            ) : specifications.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 py-10 text-center text-sm text-slate-400">
                    <Rows3 className="mx-auto mb-3 h-8 w-8 text-slate-500" aria-hidden="true" />
                    No specifications have been added yet.
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {specifications.map((specification) => (
                        <li
                            key={specification.id || specification.slug}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                        >
                            {specification.image ? (
                                <div className="aspect-[4/3] bg-slate-800">
                                    <img
                                        src={specification.image}
                                        alt={specification.specificationName}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : null}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                                            {specification.label}
                                        </p>
                                        <h3 className="mt-2 text-lg font-semibold text-white">
                                            {specification.specificationName}
                                        </h3>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                            specification.published
                                                ? 'bg-emerald-500/90 text-white'
                                                : 'bg-slate-700 text-slate-200'
                                        }`}
                                    >
                                        {specification.published ? 'Published' : 'Unpublished'}
                                    </span>
                                </div>
                                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
                                    {specification.description}
                                </p>
                                <div className="mt-4 border-t border-slate-800 pt-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        {specification.specifications?.length || 0} specification rows
                                    </p>
                                    {specification.specifications?.length > 0 && (
                                        <dl className="space-y-2">
                                            {specification.specifications.slice(0, 4).map((row, index) => (
                                                <div
                                                    key={`${row.label}-${index}`}
                                                    className="flex justify-between gap-3 text-xs"
                                                >
                                                    <dt className="text-slate-400">{row.label}</dt>
                                                    <dd className="text-right text-slate-200">{row.value}</dd>
                                                </div>
                                            ))}
                                            {specification.specifications.length > 4 && (
                                                <p className="pt-1 text-xs text-slate-500">
                                                    +{specification.specifications.length - 4} more
                                                </p>
                                            )}
                                        </dl>
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
