'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { apiPost } from '@/lib/api/client';
import { setFileInputFiles } from '@/lib/fileInput';

const EMPTY_TECHNICAL_SPEC = { feature: '', detail: '' };
const EMPTY_BENEFIT = { icon: '', title: '', text: '' };
const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';
const FILE_CLASS =
    'mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500';

function Section({ title, description, children }) {
    return (
        <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
            <div>
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
            </div>
            {children}
        </section>
    );
}

export default function ProductForm() {
    const formRef = useRef(null);
    const mainPreviewRef = useRef('');
    const galleryPreviewsRef = useRef([]);
    const galleryInputRef = useRef(null);
    const [mainImage, setMainImage] = useState(null);
    const [mainPreview, setMainPreview] = useState('');
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [specs, setSpecs] = useState(['']);
    const [technicalSpecs, setTechnicalSpecs] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(
        () => () => {
            if (mainPreviewRef.current) URL.revokeObjectURL(mainPreviewRef.current);
            galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
        },
        []
    );

    const handleMainImageChange = (event) => {
        const file = event.target.files?.[0] || null;
        if (mainPreviewRef.current) URL.revokeObjectURL(mainPreviewRef.current);

        const preview = file ? URL.createObjectURL(file) : '';
        mainPreviewRef.current = preview;
        setMainImage(file);
        setMainPreview(preview);
    };

    const handleGalleryChange = (event) => {
        const files = Array.from(event.target.files || []);
        galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));

        const previews = files.map((file) => URL.createObjectURL(file));
        galleryPreviewsRef.current = previews;
        setGalleryImages(files);
        setGalleryPreviews(previews);
    };

    const removeGalleryImage = (index) => {
        URL.revokeObjectURL(galleryPreviewsRef.current[index]);
        galleryPreviewsRef.current = galleryPreviewsRef.current.filter(
            (_, previewIndex) => previewIndex !== index
        );
        const nextFiles = galleryImages.filter((_, fileIndex) => fileIndex !== index);
        setFileInputFiles(galleryInputRef.current, nextFiles);
        setGalleryImages(nextFiles);
        setGalleryPreviews(galleryPreviewsRef.current);
    };

    const resetForm = () => {
        if (mainPreviewRef.current) URL.revokeObjectURL(mainPreviewRef.current);
        galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
        mainPreviewRef.current = '';
        galleryPreviewsRef.current = [];
        formRef.current?.reset();
        setMainImage(null);
        setMainPreview('');
        setGalleryImages([]);
        setGalleryPreviews([]);
        setSpecs(['']);
        setTechnicalSpecs([]);
        setBenefits([]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const hasIncompleteTechnicalSpec = technicalSpecs.some(
            ({ feature, detail }) => Boolean(feature.trim()) !== Boolean(detail.trim())
        );
        const hasIncompleteBenefit = benefits.some(
            ({ title, text, icon }) =>
                (Boolean(title.trim()) || Boolean(text.trim()) || Boolean(icon.trim())) &&
                (!title.trim() || !text.trim())
        );
        if (hasIncompleteTechnicalSpec || hasIncompleteBenefit) {
            setError('Complete or remove each partially filled benefit and technical specification.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        const sourceFields = new FormData(event.currentTarget);
        ['title', 'badge', 'description', 'longDescription', 'benefitsTitle', 'benefitsIntro'].forEach(
            (field) => formData.set(field, String(sourceFields.get(field) || ''))
        );
        formData.set('specs', JSON.stringify(specs.map((spec) => spec.trim()).filter(Boolean)));
        formData.set(
            'technicalSpecs',
            JSON.stringify(
                technicalSpecs
                    .map(({ feature, detail }) => ({
                        feature: feature.trim(),
                        detail: detail.trim(),
                    }))
                    .filter(({ feature, detail }) => feature && detail)
            )
        );
        formData.set(
            'benefits',
            JSON.stringify(
                benefits
                    .map(({ icon, title, text }) => ({
                        icon: icon.trim(),
                        title: title.trim(),
                        text: text.trim(),
                    }))
                    .filter(({ title, text }) => title && text)
            )
        );
        if (mainImage) formData.set('image', mainImage);
        galleryImages.forEach((file) => formData.append('gallery', file));

        try {
            const data = await apiPost('/api/products', formData);

            resetForm();
            setSuccess(`Product "${data.product.title}" and its specifications were created.`);
        } catch (requestError) {
            setError(requestError.message || 'Product could not be created.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <p
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                    role="alert"
                >
                    {error}
                </p>
            )}
            {success && (
                <p
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
                    role="status"
                >
                    {success}
                </p>
            )}

            <Section title="Product information" description="Fields for the product listing and detail page.">
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-300">
                        Product title
                        <input name="title" required maxLength={120} className={FIELD_CLASS} />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        Badge <span className="font-normal text-slate-500">(optional)</span>
                        <input name="badge" maxLength={60} className={FIELD_CLASS} placeholder="Popular choice" />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Description
                        <textarea name="description" required rows={3} maxLength={1000} className={FIELD_CLASS} />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Long description <span className="font-normal text-slate-500">(optional)</span>
                        <textarea name="longDescription" rows={5} maxLength={5000} className={FIELD_CLASS} />
                    </label>
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-300">
                            Primary product image
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                required
                                onChange={handleMainImageChange}
                                className={FILE_CLASS}
                            />
                            <span className="mt-1 block text-xs font-normal text-slate-500">
                                JPG, PNG, or WebP; maximum 4 MB.
                            </span>
                        </label>
                        {mainPreview && (
                            <Image
                                src={mainPreview}
                                alt="Primary product preview"
                                width={768}
                                height={448}
                                unoptimized
                                className="mt-4 h-56 w-full rounded-xl border border-slate-700 object-cover sm:w-96"
                            />
                        )}
                    </div>
                </div>
            </Section>

            <Section
                title="Product specifications"
                description="Short specifications displayed with the product listing."
            >
                <div className="space-y-3">
                    {specs.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                aria-label={`Product specification ${index + 1}`}
                                value={spec}
                                onChange={(event) =>
                                    setSpecs((current) =>
                                        current.map((item, itemIndex) =>
                                            itemIndex === index ? event.target.value : item
                                        )
                                    )
                                }
                                maxLength={160}
                                className={FIELD_CLASS}
                                placeholder="e.g. 10-year warranty"
                            />
                            <button
                                type="button"
                                onClick={() => setSpecs((current) => current.filter((_, i) => i !== index))}
                                aria-label={`Remove specification ${index + 1}`}
                                className="mt-2 rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setSpecs((current) => [...current, ''])}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                    >
                        <Plus className="h-4 w-4" /> Add specification
                    </button>
                </div>
            </Section>

            <Section title="Benefits" description="Optional introduction and benefit cards for the detail page.">
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-300">
                        Benefits title
                        <input name="benefitsTitle" maxLength={160} className={FIELD_CLASS} />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        Benefits introduction
                        <input name="benefitsIntro" maxLength={500} className={FIELD_CLASS} />
                    </label>
                </div>
                <div className="space-y-4">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="grid gap-3 rounded-xl border border-slate-800 p-4 sm:grid-cols-[1fr_1fr_2fr_auto]">
                            <input
                                aria-label={`Benefit ${index + 1} icon`}
                                value={benefit.icon}
                                onChange={(event) =>
                                    setBenefits((current) =>
                                        current.map((item, i) =>
                                            i === index ? { ...item, icon: event.target.value } : item
                                        )
                                    )
                                }
                                className={FIELD_CLASS}
                                placeholder="Icon key (optional)"
                            />
                            <input
                                aria-label={`Benefit ${index + 1} title`}
                                value={benefit.title}
                                onChange={(event) =>
                                    setBenefits((current) =>
                                        current.map((item, i) =>
                                            i === index ? { ...item, title: event.target.value } : item
                                        )
                                    )
                                }
                                className={FIELD_CLASS}
                                placeholder="Benefit title"
                            />
                            <input
                                aria-label={`Benefit ${index + 1} description`}
                                value={benefit.text}
                                onChange={(event) =>
                                    setBenefits((current) =>
                                        current.map((item, i) =>
                                            i === index ? { ...item, text: event.target.value } : item
                                        )
                                    )
                                }
                                className={FIELD_CLASS}
                                placeholder="Benefit description"
                            />
                            <button
                                type="button"
                                onClick={() => setBenefits((current) => current.filter((_, i) => i !== index))}
                                aria-label={`Remove benefit ${index + 1}`}
                                className="rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => setBenefits((current) => [...current, { ...EMPTY_BENEFIT }])}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                    >
                        <Plus className="h-4 w-4" /> Add benefit
                    </button>
                </div>
            </Section>

            <Section title="Technical specifications" description="Feature and detail pairs on the product details page.">
                <div className="space-y-4">
                    {technicalSpecs.map((spec, index) => (
                        <div key={index} className="grid gap-3 rounded-xl border border-slate-800 p-4 sm:grid-cols-[1fr_2fr_auto]">
                            <input
                                aria-label={`Technical spec ${index + 1} feature`}
                                value={spec.feature}
                                onChange={(event) =>
                                    setTechnicalSpecs((current) =>
                                        current.map((item, i) =>
                                            i === index ? { ...item, feature: event.target.value } : item
                                        )
                                    )
                                }
                                className={FIELD_CLASS}
                                placeholder="Feature"
                            />
                            <input
                                aria-label={`Technical spec ${index + 1} detail`}
                                value={spec.detail}
                                onChange={(event) =>
                                    setTechnicalSpecs((current) =>
                                        current.map((item, i) =>
                                            i === index ? { ...item, detail: event.target.value } : item
                                        )
                                    )
                                }
                                className={FIELD_CLASS}
                                placeholder="Specification detail"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setTechnicalSpecs((current) => current.filter((_, i) => i !== index))
                                }
                                aria-label={`Remove technical spec ${index + 1}`}
                                className="rounded-xl border border-slate-700 px-3 text-slate-400 transition hover:border-red-500 hover:text-red-300"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setTechnicalSpecs((current) => [...current, { ...EMPTY_TECHNICAL_SPEC }])
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                    >
                        <Plus className="h-4 w-4" /> Add technical specification
                    </button>
                </div>
            </Section>

            <Section
                title="Product gallery"
                description="Add up to 20 additional JPG, PNG, or WebP images (maximum 4 MB each)."
            >
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleGalleryChange}
                    className={FILE_CLASS}
                />
                {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {galleryPreviews.map((preview, index) => (
                            <div key={preview} className="relative">
                                <Image
                                    src={preview}
                                    alt={`Product gallery preview ${index + 1}`}
                                    width={400}
                                    height={256}
                                    unoptimized
                                    className="h-32 w-full rounded-lg border border-slate-700 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    aria-label={`Remove product gallery image ${index + 1}`}
                                    className="absolute right-2 top-2 rounded-full bg-slate-950/90 p-1.5 text-white transition hover:bg-red-600"
                                >
                                    <X className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            <div className="flex flex-wrap justify-end gap-3">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                        resetForm();
                        setError('');
                        setSuccess('');
                    }}
                    className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
                >
                    Clear form
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-yellow-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Creating product…' : 'Create product'}
                </button>
            </div>
        </form>
    );
}
