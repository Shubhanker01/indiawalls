'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { searchProjects, updateProject } from '@/lib/api/products';

const EMPTY_FORM = {
    title: '',
    category: '',
    location: '',
    description: '',
    image: '',
    gallery: [],
};

const fieldClassName =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500';

function imageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/images/')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_IMAGES?.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export default function UpdateProjectForm() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const galleryPreviewsRef = useRef([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => () => galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview)), []);

    useEffect(() => {
        const term = query.trim();
        if (!term || selectedProject) {
            setResults([]);
            setIsSearching(false);
            return undefined;
        }

        const controller = new AbortController();
        setIsSearching(true);
        const timeout = setTimeout(async () => {
            try {
                const data = await searchProjects(term, controller.signal);
                setResults(data.results);
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setError(requestError.data?.error || 'Could not search projects.');
                }
            } finally {
                if (!controller.signal.aborted) setIsSearching(false);
            }
        }, 250);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query, selectedProject]);

    const chooseProject = (project) => {
        setSelectedProject(project);
        galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
        galleryPreviewsRef.current = [];
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setFormData({
            title: project.title,
            category: project.category || '',
            location: project.location || '',
            description: project.description || '',
            image: project.image || '',
            gallery: project.gallery || [],
        });
        setQuery(project.title);
        setResults([]);
        setError('');
        setSuccess('');
    };

    const closeProject = () => {
        setSelectedProject(null);
        setFormData(EMPTY_FORM);
        galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
        galleryPreviewsRef.current = [];
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setQuery('');
        setError('');
        setSuccess('');
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
    };

    const handleGalleryChange = (event) => {
        const files = Array.from(event.target.files || []);
        galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
        galleryPreviewsRef.current = files.map((file) => URL.createObjectURL(file));
        setGalleryFiles(files);
        setGalleryPreviews(galleryPreviewsRef.current);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedProject) return;

        setError('');
        setSuccess('');
        setIsSaving(true);
        try {
            const projectData = {
                currentTitle: selectedProject.title,
                ...formData,
            };
            const updateData = new FormData();
            updateData.append('project', JSON.stringify(projectData));
            galleryFiles.forEach((file) => updateData.append('galleryFiles', file));
            const data = await updateProject(updateData);
            setSelectedProject((current) => ({ ...current, ...data.project }));
            setFormData((current) => ({ ...current, ...data.project }));
            galleryPreviewsRef.current.forEach((preview) => URL.revokeObjectURL(preview));
            galleryPreviewsRef.current = [];
            setGalleryFiles([]);
            setGalleryPreviews([]);
            setSuccess('Project updated successfully.');
        } catch (requestError) {
            setError(requestError.data?.error || 'Could not update project.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
            {!selectedProject ? (
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-300">
                        Search projects by title
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setResults([]);
                                setError('');
                            }}
                            placeholder="Start typing a project title"
                            autoComplete="off"
                            className={fieldClassName}
                        />
                    </label>
                    {isSearching && <p className="mt-2 text-sm text-slate-400">Searching...</p>}
                    {results.length > 0 && (
                        <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 shadow-xl">
                            {results.map((project) => (
                                <li key={project.title}>
                                    <button
                                        type="button"
                                        onClick={() => chooseProject(project)}
                                        className="w-full px-4 py-3 text-left hover:bg-slate-800"
                                    >
                                        <span className="block text-sm font-semibold text-slate-100">
                                            {project.title}
                                        </span>
                                        <span className="mt-1 block text-xs text-slate-400">
                                            {[project.category, project.location].filter(Boolean).join(' · ')}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isSearching && query.trim() && results.length === 0 && !error && (
                        <p className="mt-2 text-sm text-slate-400">No matching projects found.</p>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Update project</h2>
                            <p className="mt-1 text-sm text-slate-400">
                                Edit the project details below. The project ID is not needed.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={closeProject}
                            aria-label="Close update form"
                            className="rounded-lg border border-slate-700 px-3 py-2 text-lg leading-none text-slate-300 transition hover:border-red-500 hover:text-red-400"
                        >
                            ×
                        </button>
                    </div>

                    {error && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                            {error}
                        </p>
                    )}
                    {success && <p className="text-sm text-emerald-400" role="status">{success}</p>}

                    <label className="block text-sm font-medium text-slate-300">
                        Title
                        <input name="title" required value={formData.title} onChange={handleChange} className={fieldClassName} />
                    </label>
                    <label className="block text-sm font-medium text-slate-300">
                        Category
                        <input name="category" required value={formData.category} onChange={handleChange} className={fieldClassName} />
                    </label>
                    <label className="block text-sm font-medium text-slate-300">
                        Location
                        <input name="location" required value={formData.location} onChange={handleChange} className={fieldClassName} />
                    </label>
                    <label className="block text-sm font-medium text-slate-300">
                        Description
                        <textarea name="description" required rows="5" value={formData.description} onChange={handleChange} className={fieldClassName} />
                    </label>

                    <div>
                        <p className="text-sm font-medium text-slate-300">Main image</p>
                        {formData.image ? (
                            <div className="relative mt-2 overflow-hidden rounded-xl border border-slate-700">
                                <img
                                    src={imageUrl(formData.image)}
                                    alt={`${formData.title} main project image`}
                                    className="h-56 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData((current) => ({ ...current, image: '' }))}
                                    aria-label="Remove main image"
                                    className="absolute right-3 top-3 rounded-full bg-slate-950/90 px-3 py-1 text-xl leading-none text-white hover:bg-red-700"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-amber-300">
                                Main image removed. Enter an image path below to replace it.
                            </p>
                        )}
                        <label className="mt-3 block text-sm font-medium text-slate-300">
                            Main image path
                            <input
                                name="image"
                                type="text"
                                required
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="projects/image.jpg"
                                className={fieldClassName}
                            />
                        </label>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-300">Gallery (optional)</p>
                        {formData.gallery.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {formData.gallery.map((item, index) => (
                                    <div key={`${item.src}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-700">
                                        <img
                                            src={imageUrl(item.src)}
                                            alt={item.alt || `Project gallery image ${index + 1}`}
                                            className="h-32 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((current) => ({
                                                    ...current,
                                                    gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index),
                                                }))
                                            }
                                            aria-label={`Remove gallery image ${index + 1}`}
                                            className="absolute right-2 top-2 rounded-full bg-slate-950/90 p-1.5 text-white transition hover:bg-red-600"
                                        >
                                            <X size={16} aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {formData.gallery.length === 0 && (
                            <label className="mt-3 block text-sm font-medium text-slate-300">
                                Upload gallery images
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    onChange={handleGalleryChange}
                                    className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500"
                                />
                            </label>
                        )}
                        {galleryPreviews.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {galleryPreviews.map((preview, index) => (
                                    <div key={preview} className="relative overflow-hidden rounded-lg border border-slate-700">
                                        <img
                                            src={preview}
                                            alt={`New gallery image ${index + 1}: ${galleryFiles[index]?.name || ''}`}
                                            className="h-32 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                URL.revokeObjectURL(preview);
                                                galleryPreviewsRef.current = galleryPreviewsRef.current.filter(
                                                    (_, previewIndex) => previewIndex !== index
                                                );
                                                setGalleryFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
                                                setGalleryPreviews((current) => current.filter((_, previewIndex) => previewIndex !== index));
                                            }}
                                            aria-label={`Remove selected gallery image ${index + 1}`}
                                            className="absolute right-2 top-2 rounded-full bg-slate-950/90 p-1.5 text-white transition hover:bg-red-600"
                                        >
                                            <X size={16} aria-hidden="true" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </button>
                </form>
            )}

            {!selectedProject && error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                    {error}
                </p>
            )}
        </section>
    );
}
