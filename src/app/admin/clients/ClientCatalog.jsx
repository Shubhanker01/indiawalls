'use client';

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ClientCatalog() {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function loadCatalog() {
            try {
                const response = await fetch('/api/clients');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Could not load the clients catalog.');
                }
                if (isMounted) setClients(data.clients);
            } catch (requestError) {
                if (isMounted) {
                    setError(requestError.message || 'Could not load the clients catalog.');
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
                    <h2 className="text-lg font-semibold text-white">Clients catalog</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {clients.length} {clients.length === 1 ? 'client' : 'clients'}
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
                    Loading clients...
                </div>
            ) : clients.length === 0 ? (
                <p className="rounded-xl border border-slate-800 bg-slate-950 py-10 text-center text-sm text-slate-400">
                    No clients have been added yet.
                </p>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {clients.map((client) => (
                        <li
                            key={client.id || client.slug}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                        >
                            <div className="flex h-44 items-center justify-center bg-white p-6">
                                {client.logo ? (
                                    <img
                                        src={client.logo}
                                        alt={`${client.name} logo`}
                                        loading="lazy"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <span className="text-sm text-slate-500">No client logo</span>
                                )}
                            </div>
                            <div className="flex items-center justify-between gap-3 p-5">
                                <h3 className="font-semibold text-white">{client.name}</h3>
                                <span
                                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                        client.published
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-slate-700 text-slate-200'
                                    }`}
                                >
                                    {client.published ? 'Published' : 'Unpublished'}
                                </span>
                            </div>
                            <p className="border-t border-slate-800 px-5 py-3 text-xs text-slate-400">
                                Display order: {client.order ?? 0}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
