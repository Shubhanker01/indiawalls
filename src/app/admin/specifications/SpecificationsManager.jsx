'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, Pencil, Plus, Trash2, Rows3 } from 'lucide-react';
import Image from 'next/image';
import DeleteSpecificationForm from './DeleteSpecificationForm';
import UpdateSpecificationForm from './UpdateSpecificationForm';
import SpecificationCatalog from './SpecificationCatalog';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

const MODES = [
    { id: 'create', label: 'Create', icon: Plus },
    { id: 'update', label: 'Update', icon: Pencil },
    { id: 'delete', label: 'Delete', icon: Trash2 },
    { id: 'catalog', label: 'Show Catalog', icon: Rows3 },
];

const EMPTY_FORM = {
    specificationName: '',
    slug: '',
    label: '',
    description: '',
    published: true,
};

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 100);
}

function SpecificationCreateForm() {
    const formRef = useRef(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [specifications, setSpecifications] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [slugEdited, setSlugEdited] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
    }, [imagePreview]);

    function updateField(field, value) {
        setForm((current) => {
            const next = { ...current, [field]: value };
            if (field === 'specificationName' && !slugEdited) {
                next.slug = slugify(value);
            }
            return next;
        });
    }

    function updateSpecification(index, field, value) {
        setSpecifications((current) =>
            current.map((row, rowIndex) =>
                rowIndex === index ? { ...row, [field]: value } : row
            )
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');
        if (!imageFile) {
            setError('Select an image file for this specification.');
            return;
        }
        setIsSaving(true);

        try {
            const formData = new FormData();
            formData.set(
                'payload',
                JSON.stringify({
                    ...form,
                    specifications,
                })
            );
            formData.set('image', imageFile);
            const response = await fetch('/api/specifications', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Specification could not be created.');
            }

            formRef.current?.reset();
            setForm(EMPTY_FORM);
            setSpecifications([]);
            setImageFile(null);
            setImagePreview('');
            setSlugEdited(false);
            setSuccess(`Specification "${data.specification.specificationName}" was created.`);
        } catch (requestError) {
            setError(requestError.message || 'Specification could not be created.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                </p>
            )}
            {success && (
                <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                    {success}
                </p>
            )}

            <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                <div>
                    <h3 className="text-lg font-bold text-white">Specification information</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Add the public name, content, and 2D specification image.
                    </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-300">
                        Specification name
                        <input
                            required
                            maxLength={160}
                            value={form.specificationName}
                            onChange={(event) => updateField('specificationName', event.target.value)}
                            placeholder="RCC Columns"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        Slug
                        <input
                            required
                            maxLength={100}
                            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                            value={form.slug}
                            onChange={(event) => {
                                setSlugEdited(true);
                                updateField('slug', event.target.value.toLowerCase());
                            }}
                            placeholder="rcc-columns"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Label
                        <input
                            required
                            maxLength={160}
                            value={form.label}
                            onChange={(event) => updateField('label', event.target.value)}
                            placeholder="Precast RCC Component"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Description
                        <textarea
                            required
                            rows={4}
                            maxLength={5000}
                            value={form.description}
                            onChange={(event) => updateField('description', event.target.value)}
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Specification image
                        <input
                            required
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) => {
                                const file = event.target.files?.[0] || null;
                                setImageFile(file);
                                setImagePreview(file ? URL.createObjectURL(file) : '');
                            }}
                            className={`${FIELD_CLASS} file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500`}
                        />
                        <span className="mt-2 block text-xs font-normal text-slate-500">
                            Choose a JPG, PNG, or WebP image up to 4 MB to upload.
                        </span>
                    </label>
                    {imagePreview && (
                        <div className="relative aspect-video max-w-lg overflow-hidden rounded-xl border border-slate-700 sm:col-span-2">
                            <Image
                                src={imagePreview}
                                alt="Selected specification preview"
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, 512px"
                                className="object-contain"
                            />
                        </div>
                    )}
                    <label className="flex items-center gap-3 self-end pb-3 text-sm font-medium text-slate-300">
                        <input
                            type="checkbox"
                            checked={form.published}
                            onChange={(event) => updateField('published', event.target.checked)}
                            className="h-4 w-4 accent-yellow-500"
                        />
                        Published
                    </label>
                </div>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-bold text-white">Specification table</h3>
                        <p className="mt-1 text-sm text-slate-400">
                            Add label and value rows for the public specification table.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSpecifications((current) => [...current, { label: '', value: '' }])}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-yellow-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add row
                    </button>
                </div>
                {specifications.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-700 px-4 py-6 text-center text-sm text-slate-500">
                        No table rows added.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {specifications.map((row, index) => (
                            <div key={index} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                                <label className="text-sm font-medium text-slate-300">
                                    Row {index + 1} label
                                    <input
                                        required
                                        maxLength={160}
                                        value={row.label}
                                        onChange={(event) => updateSpecification(index, 'label', event.target.value)}
                                        placeholder="Length"
                                        className={FIELD_CLASS}
                                    />
                                </label>
                                <label className="text-sm font-medium text-slate-300">
                                    Value
                                    <input
                                        required
                                        maxLength={500}
                                        value={row.value}
                                        onChange={(event) => updateSpecification(index, 'value', event.target.value)}
                                        placeholder="6 Feet"
                                        className={FIELD_CLASS}
                                    />
                                </label>
                                <button
                                    type="button"
                                    aria-label={`Remove row ${index + 1}`}
                                    onClick={() =>
                                        setSpecifications((current) =>
                                            current.filter((_, rowIndex) => rowIndex !== index)
                                        )
                                    }
                                    className="mt-7 inline-flex h-11 items-center justify-center rounded-xl border border-red-500/30 px-3 text-red-300 transition hover:bg-red-500/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {isSaving ? 'Creating…' : 'Create specification'}
            </button>
        </form>
    );
}

export default function SpecificationsManager() {
    const [mode, setMode] = useState('create');
    const activeMode = MODES.find((item) => item.id === mode);
    const ActiveIcon = activeMode.icon;

    return (
        <>
            <header className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    Admin Panel
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                    Specification management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Create, update, or delete public product specifications.
                </p>
            </header>

            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Specification actions">
                {MODES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`specification-mode-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={mode === id}
                        aria-controls="specification-mode-panel"
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
                id="specification-mode-panel"
                role="tabpanel"
                aria-labelledby={`specification-mode-${mode}`}
                className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6"
            >
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ActiveIcon className="h-5 w-5 text-yellow-400" />
                    {mode === 'catalog' ? 'Specifications catalog' : `${activeMode.label} specification`}
                </h2>
                {mode === 'create' ? (
                    <SpecificationCreateForm />
                ) : mode === 'update' ? (
                    <UpdateSpecificationForm />
                ) : mode === 'delete' ? (
                    <DeleteSpecificationForm />
                ) : mode === 'catalog' ? (
                    <SpecificationCatalog />
                ) : (
                    <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-400">
                        {activeMode.label} specifications will be available here in a future update.
                    </p>
                )}
            </section>
        </>
    );
}
