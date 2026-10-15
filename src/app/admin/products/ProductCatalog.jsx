'use client';

import { useEffect, useState } from 'react';
import { Loader2, PackageSearch, RefreshCw } from 'lucide-react';

function getImageUrl(image) {
    if (!image) return '';
    if (/^https?:\/\//.test(image) || image.startsWith('/')) return image;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGES?.replace(/\/+$/, '');
    return baseUrl ? `${baseUrl}/${image}` : `/${image}`;
}

export default function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    async function loadCatalog(signal) {
        setError('');
        try {
            const response = await fetch('/api/products?adminCatalog=1', { signal });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Could not load the product catalog.');
            setProducts(data.products);
        } catch (requestError) {
            if (requestError.name !== 'AbortError') {
                setError(requestError.message || 'Could not load the product catalog.');
            }
        } finally {
            if (!signal?.aborted) setIsLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        loadCatalog(controller.signal);
        return () => controller.abort();
    }, []);

    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold text-white">Product catalog</h2>
                    <p className="mt-1 text-sm text-slate-400">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setIsLoading(true);
                        loadCatalog();
                    }}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-yellow-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                    Refresh
                </button>
            </div>

            {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400" role="status">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Loading catalog...
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950 py-10 text-center text-sm text-slate-400">
                    <PackageSearch className="mx-auto mb-3 h-8 w-8 text-slate-500" aria-hidden="true" />
                    No products have been added yet.
                </div>
            ) : (
                <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                        <li
                            key={product.id || product.slug}
                            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950"
                        >
                            <div className="relative aspect-[4/3] bg-slate-800">
                                {product.image ? (
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                                        No product image
                                    </div>
                                )}
                                <span
                                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                                        product.published
                                            ? 'bg-emerald-500/90 text-white'
                                            : 'bg-slate-700/90 text-slate-200'
                                    }`}
                                >
                                    {product.published ? 'Published' : 'Unpublished'}
                                </span>
                            </div>
                            <div className="p-5">
                                {product.badge && (
                                    <p className="text-xs font-semibold uppercase tracking-wide text-yellow-400">
                                        {product.badge}
                                    </p>
                                )}
                                <h3 className="mt-2 text-lg font-semibold text-white">{product.title}</h3>
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">
                                    {product.description}
                                </p>
                                {product.specs?.length > 0 && (
                                    <p className="mt-3 text-xs text-slate-400">
                                        {product.specs.length} {product.specs.length === 1 ? 'specification' : 'specifications'}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
