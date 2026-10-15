'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, RefreshCw } from 'lucide-react';
import { apiGet } from '@/lib/api/client';

export default function ManufacturingUnitsCatalog() {
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadCatalog() {
            try {
                const data = await apiGet('/api/manufacturing-units');
                if (isMounted) setUnits(data.units);
            } catch (requestError) {
                if (isMounted) {
                    setError(requestError.message || 'Could not load manufacturing units.');
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
                    <h2 className="text-lg font-semibold text-white">Manufacturing units catalog</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {units.length} {units.length === 1 ? 'unit' : 'units'}
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
                    Loading manufacturing units...
                </div>
            ) : units.length === 0 ? (
                <p className="rounded-xl border border-slate-800 bg-slate-950 py-10 text-center text-sm text-slate-400">
                    No manufacturing units have been added yet.
                </p>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {units.map((unit) => (
                        <li
                            key={unit.id || unit.slug}
                            className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                                        {unit.region || 'Manufacturing unit'}
                                    </p>
                                    <h3 className="mt-2 text-lg font-semibold text-white">{unit.city}</h3>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        unit.published
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-slate-700 text-slate-200'
                                    }`}
                                >
                                    {unit.published ? 'Published' : 'Unpublished'}
                                </span>
                            </div>

                            <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                                <MapPin
                                    size={16}
                                    className="mt-0.5 shrink-0 text-yellow-400"
                                    aria-hidden="true"
                                />
                                {unit.address || 'Address not set'}
                            </p>

                            {(unit.lat != null || unit.lng != null) && (
                                <p className="mt-3 text-xs text-slate-400">
                                    Coordinates: {unit.lat ?? '—'}, {unit.lng ?? '—'}
                                </p>
                            )}

                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
                                <span>Display order: {unit.order ?? 0}</span>
                                {unit.mapsUrl && (
                                    <a
                                        href={unit.mapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-semibold text-yellow-400 transition hover:text-yellow-300"
                                    >
                                        Open map
                                    </a>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
