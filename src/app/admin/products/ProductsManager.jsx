'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronDown, Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import ProductForm from './ProductForm';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

const MODES = [
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'update', label: 'Update', icon: Pencil },
    { id: 'delete', label: 'Delete', icon: Trash2 },
];

const DETAIL_FIELDS = [
    { key: 'benefitsIntro', label: 'Benefits introduction', type: 'text' },
    { key: 'benefitsTitle', label: 'Benefits title', type: 'text' },
    { key: 'gallery', label: 'Gallery', type: 'gallery', initial: [] },
    { key: 'hero', label: 'Hero (JSON object)', type: 'object', initial: {} },
    { key: 'installationSteps', label: 'Installation steps', type: 'installationSteps', initial: [] },
    { key: 'installationTitle', label: 'Installation title', type: 'text' },
    { key: 'manufacturingSteps', label: 'Manufacturing steps', type: 'manufacturingSteps', initial: [] },
    { key: 'processTitle', label: 'Process title', type: 'text' },
];

function UpdateProductForm() {
    const [products, setProducts] = useState([]);
    const [selectedSlug, setSelectedSlug] = useState('');
    const [product, setProduct] = useState({ title: '', description: '', badge: '', specs: [] });
    const [details, setDetails] = useState({});
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(
        () => () => galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview)),
        [galleryPreviews]
    );

    useEffect(() => {
        let isMounted = true;
        fetch('/api/products')
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Could not load products.');
                if (isMounted) setProducts(data);
            })
            .catch((requestError) => {
                if (isMounted) setError(requestError.message || 'Could not load products.');
            })
            .finally(() => {
                if (isMounted) setIsLoadingProducts(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    async function loadProduct(slug) {
        setSelectedSlug(slug);
        setError('');
        setSuccess('');
        if (!slug) {
            setProduct({ title: '', description: '', badge: '', specs: [] });
            setDetails({});
            setGalleryFiles([]);
            setGalleryPreviews([]);
            return;
        }

        galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setIsLoadingProduct(true);
        try {
            const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Could not load this product.');

            setProduct({
                title: data.product.title || '',
                description: data.product.description || '',
                badge: data.product.badge || '',
                specs: data.product.specs || [],
            });
            setDetails(
                Object.fromEntries(
                    DETAIL_FIELDS.map(({ key, type, initial }) => {
                        const value = data.productDetail?.[key];
                        return [
                            key,
                            type === 'text'
                                ? value || ''
                                : type === 'object'
                                    ? JSON.stringify(value ?? initial, null, 2)
                                    : value ?? initial,
                        ];
                    })
                )
            );
        } catch (requestError) {
            setError(requestError.message || 'Could not load this product.');
        } finally {
            setIsLoadingProduct(false);
        }
    }

    function handleGalleryChange(event) {
        const files = Array.from(event.target.files || []);
        if (files.length > 20) {
            setError('Choose no more than 20 gallery images.');
            event.target.value = '';
            return;
        }
        galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
        setGalleryFiles(files);
        setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
        setError('');
    }

    function removeGalleryFile(index) {
        URL.revokeObjectURL(galleryPreviews[index]);
        setGalleryFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
        setGalleryPreviews((current) => current.filter((_, previewIndex) => previewIndex !== index));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        const parsedDetails = {};
        try {
            for (const field of DETAIL_FIELDS) {
                if (field.type === 'object') {
                    parsedDetails[field.key] = JSON.parse(details[field.key]);
                } else {
                    parsedDetails[field.key] = details[field.key];
                }
            }
        } catch (parseError) {
            setError(parseError instanceof SyntaxError ? 'The hero field must contain valid JSON.' : parseError.message);
            return;
        }

        setIsSaving(true);
        try {
            const updateData = new FormData();
            updateData.set('payload', JSON.stringify({
                    product: {
                        title: product.title,
                        description: product.description,
                        badge: product.badge,
                        specs: product.specs.map((spec) => spec.trim()).filter(Boolean),
                    },
                    productDetail: {
                        slug: selectedSlug,
                        ...parsedDetails,
                        gallery: undefined,
                    },
                }));
            galleryFiles.forEach((file) => updateData.append('galleryFiles', file));

            const response = await fetch('/api/products', {
                method: 'PUT',
                body: updateData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Product could not be updated.');

            setSuccess(`Product "${data.product.title}" and its details were updated.`);
            setDetails((current) => ({ ...current, gallery: data.productDetail.gallery || [] }));
            galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
            setGalleryFiles([]);
            setGalleryPreviews([]);
            if (data.product.slug !== selectedSlug) {
                setSelectedSlug(data.product.slug);
            }
        } catch (requestError) {
            setError(requestError.message || 'Product could not be updated.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-slate-300">
                Select product to update
                <span className="relative block">
                    <select
                        value={selectedSlug}
                        onChange={(event) => loadProduct(event.target.value)}
                        disabled={isLoadingProducts || isLoadingProduct || isSaving}
                        className={`${FIELD_CLASS} appearance-none pr-10`}
                    >
                        <option value="">
                            {isLoadingProducts ? 'Loading products…' : 'Choose a product'}
                        </option>
                        {products.map((item) => (
                            <option key={item.slug} value={item.slug}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </span>
            </label>

            {isLoadingProduct && (
                <p className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading product details…
                </p>
            )}

            {selectedSlug && !isLoadingProduct && (
                <>
                    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                        <h2 className="text-lg font-bold text-white">Product information</h2>
                        <label className="block text-sm font-medium text-slate-300">
                            Title
                            <input
                                required
                                value={product.title}
                                onChange={(event) => setProduct({ ...product, title: event.target.value })}
                                className={FIELD_CLASS}
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-300">
                            Description
                            <textarea
                                required
                                rows={3}
                                value={product.description}
                                onChange={(event) => setProduct({ ...product, description: event.target.value })}
                                className={FIELD_CLASS}
                            />
                        </label>
                        <label className="block text-sm font-medium text-slate-300">
                            Badge
                            <input
                                value={product.badge}
                                onChange={(event) => setProduct({ ...product, badge: event.target.value })}
                                className={FIELD_CLASS}
                            />
                        </label>
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-300">Product specifications</h3>
                            {product.specs.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        aria-label={`Product specification ${index + 1}`}
                                        value={spec}
                                        onChange={(event) =>
                                            setProduct((current) => ({
                                                ...current,
                                                specs: current.specs.map((item, itemIndex) =>
                                                    itemIndex === index ? event.target.value : item
                                                ),
                                            }))
                                        }
                                        className={FIELD_CLASS}
                                        placeholder="e.g. 10-year warranty"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProduct((current) => ({
                                                ...current,
                                                specs: current.specs.filter((_, itemIndex) => itemIndex !== index),
                                            }))
                                        }
                                        aria-label={`Remove specification ${index + 1}`}
                                        className="mt-2 rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setProduct((current) => ({ ...current, specs: [...current.specs, ''] }))
                                }
                                className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                            >
                                <Plus className="h-4 w-4" /> Add specification
                            </button>
                        </div>
                    </section>

                    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                        <h2 className="text-lg font-bold text-white">Product details</h2>
                        {DETAIL_FIELDS.map(({ key, label, type }) => (
                            <div key={key} className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300">
                                    {label}
                                    {type === 'text' ? (
                                    <input
                                        value={details[key] || ''}
                                        onChange={(event) =>
                                            setDetails({ ...details, [key]: event.target.value })
                                        }
                                        className={FIELD_CLASS}
                                    />
                                    ) : type === 'object' ? (
                                    <textarea
                                        rows={7}
                                        value={details[key] || ''}
                                        onChange={(event) =>
                                            setDetails({ ...details, [key]: event.target.value })
                                        }
                                        className={`${FIELD_CLASS} font-mono`}
                                    />
                                    ) : null}
                                </label>

                                {type === 'gallery' && (
                                    (details.gallery || []).length > 0 ? (
                                        <div className="space-y-2">
                                            <p className="text-xs text-slate-400">
                                                This product already has {details.gallery.length} gallery image
                                                {details.gallery.length === 1 ? '' : 's'}. Gallery uploads are only
                                                available when the gallery is empty.
                                            </p>
                                            {details.gallery.map((image, index) => (
                                                <p
                                                    key={`${image.src}-${index}`}
                                                    className="truncate rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-400"
                                                >
                                                    {image.alt || image.caption || `Gallery image ${index + 1}`}
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <p className="text-xs text-slate-400">
                                                Select up to 20 JPG, PNG, or WebP files (maximum 4 MB each).
                                                Images will be uploaded to Supabase Storage.
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                multiple
                                                onChange={handleGalleryChange}
                                                className={FIELD_CLASS}
                                            />
                                            {galleryPreviews.length > 0 && (
                                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                    {galleryPreviews.map((preview, index) => (
                                                        <div key={preview} className="relative">
                                                            <Image
                                                                src={preview}
                                                                alt={`Gallery upload preview ${index + 1}`}
                                                                width={400}
                                                                height={224}
                                                                unoptimized
                                                                className="h-28 w-full rounded-lg border border-slate-700 object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeGalleryFile(index)}
                                                                aria-label={`Remove selected image ${index + 1}`}
                                                                className="absolute right-1 top-1 rounded-md bg-slate-950/90 p-1.5 text-red-300 hover:text-red-200"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}

                                {type === 'installationSteps' && (
                                    <>
                                        {(details.installationSteps || []).map((step, index) => (
                                            <div key={index} className="grid gap-3 rounded-xl border border-slate-800 p-4 sm:grid-cols-[1fr_2fr_1fr_auto]">
                                                {['title', 'description', 'image'].map((field) => (
                                                    <input
                                                        key={field}
                                                        required={field === 'title'}
                                                        aria-label={`Installation step ${index + 1} ${field}`}
                                                        value={step[field] || ''}
                                                        onChange={(event) =>
                                                            setDetails((current) => ({
                                                                ...current,
                                                                installationSteps: current.installationSteps.map((item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? { ...item, [field]: event.target.value }
                                                                        : item
                                                                ),
                                                            }))
                                                        }
                                                        className={FIELD_CLASS}
                                                        placeholder={field === 'image' ? 'Image path (optional)' : field}
                                                    />
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDetails((current) => ({
                                                            ...current,
                                                            installationSteps: current.installationSteps.filter((_, itemIndex) => itemIndex !== index),
                                                        }))
                                                    }
                                                    aria-label={`Remove installation step ${index + 1}`}
                                                    className="mt-2 rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDetails((current) => ({
                                                    ...current,
                                                    installationSteps: [...(current.installationSteps || []), { title: '', description: '', image: '' }],
                                                }))
                                            }
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                                        >
                                            <Plus className="h-4 w-4" /> Add installation step
                                        </button>
                                    </>
                                )}

                                {type === 'manufacturingSteps' && (
                                    <>
                                        {(details.manufacturingSteps || []).map((step, index) => (
                                            <div key={index} className="grid gap-3 rounded-xl border border-slate-800 p-4 sm:grid-cols-[auto_1fr_2fr_1fr_auto]">
                                                {['step', 'title', 'description', 'image'].map((field) => (
                                                    <input
                                                        key={field}
                                                        required={field === 'title' || field === 'description'}
                                                        aria-label={`Manufacturing step ${index + 1} ${field}`}
                                                        value={step[field] || ''}
                                                        onChange={(event) =>
                                                            setDetails((current) => ({
                                                                ...current,
                                                                manufacturingSteps: current.manufacturingSteps.map((item, itemIndex) =>
                                                                    itemIndex === index
                                                                        ? { ...item, [field]: event.target.value }
                                                                        : item
                                                                ),
                                                            }))
                                                        }
                                                        className={FIELD_CLASS}
                                                        placeholder={field === 'image' ? 'Image path (optional)' : field}
                                                    />
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setDetails((current) => ({
                                                            ...current,
                                                            manufacturingSteps: current.manufacturingSteps.filter((_, itemIndex) => itemIndex !== index),
                                                        }))
                                                    }
                                                    aria-label={`Remove manufacturing step ${index + 1}`}
                                                    className="mt-2 rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDetails((current) => ({
                                                    ...current,
                                                    manufacturingSteps: [...(current.manufacturingSteps || []), { step: '', title: '', description: '', image: '' }],
                                                }))
                                            }
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                                        >
                                            <Plus className="h-4 w-4" /> Add manufacturing step
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </section>
                </>
            )}

            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
            {success && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{success}</p>}

            {selectedSlug && (
                <button
                    type="submit"
                    disabled={isSaving || isLoadingProduct}
                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isSaving ? 'Updating…' : 'Save product updates'}
                </button>
            )}
        </form>
    );
}

function DeleteProductForm() {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        setIsDeleting(true);
        try {
            const response = await fetch('/api/products', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim() }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.productDeleted
                        ? `${data.error} The product is already deleted.`
                        : data.error || 'Product could not be deleted.'
                );
            }
            setSuccess(`Product "${data.product.title}" and its details were deleted.`);
            setTitle('');
        } catch (requestError) {
            setError(requestError.message || 'Product could not be deleted.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-slate-300">
                Deleting a product also removes its detail page and stored gallery images. This cannot be undone.
            </div>
            <label className="block text-sm font-medium text-slate-300">
                Product title
                <input
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter the exact product title"
                    className={FIELD_CLASS}
                />
            </label>
            {error && <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</p>}
            {success && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{success}</p>}
            <button
                type="submit"
                disabled={isDeleting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Deleting…' : 'Delete product'}
            </button>
        </form>
    );
}

export default function ProductsManager() {
    const [mode, setMode] = useState('create');
    const activeMode = MODES.find((item) => item.id === mode);
    const ActiveIcon = activeMode.icon;

    return (
        <>
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    Admin Panel
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                    Product management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Create, update, or delete products and their detail-page content.
                </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Product actions">
                {MODES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`product-mode-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={mode === id}
                        aria-controls="product-mode-panel"
                        onClick={() => setMode(id)}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                            mode === id
                                ? id === 'delete'
                                    ? 'border-red-500 bg-red-600 text-white'
                                    : 'border-yellow-500 bg-yellow-600 text-white'
                                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                ))}
            </div>

            <section
                id="product-mode-panel"
                role="tabpanel"
                aria-labelledby={`product-mode-${mode}`}
                className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6"
            >
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ActiveIcon className="h-5 w-5 text-yellow-400" />
                    {activeMode.label} product
                </h2>
                {mode === 'create' && <ProductForm />}
                {mode === 'update' && <UpdateProductForm />}
                {mode === 'delete' && <DeleteProductForm />}
            </section>
        </>
    );
}
