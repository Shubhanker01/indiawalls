'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { handleUpload } from './handleUpload';

const initialFormData = {
    projectName: '',
    clientName: '',
    location: '',
    requirements: '',
};

export default function FormPanelPage() {
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [state, formAction, isSubmitting] = useActionState(handleUpload, {
        error: '',
        success: false,
    });
    const imageInputRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((currentData) => ({ ...currentData, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setImageFile(null);
        setImagePreview('');

        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    useEffect(() => {
        if (state.success || state.error) {
            resetForm();
        }
    }, [state]);

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                        Admin Panel
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Product Specification
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Add the details for a new project specification.
                    </p>
                </div>

                <form
                    action={formAction}
                    className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
                >
                    {state.error && (
                        <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400" role="alert">
                            {state.error}
                        </p>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-300">
                            Project name
                            <input
                                name="projectName"
                                type="text"
                                required
                                value={formData.projectName}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-300">
                            Client name
                            <input
                                name="clientName"
                                type="text"
                                required
                                value={formData.clientName}
                                onChange={handleChange}
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                            />
                        </label>
                    </div>

                    <label className="block text-sm font-medium text-slate-300">
                        Site location
                        <input
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Project requirements
                        <textarea
                            name="requirements"
                            rows="5"
                            required
                            value={formData.requirements}
                            onChange={handleChange}
                            className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Product image
                        <input
                            name="image"
                            type="file"
                            accept="image/*"
                            required
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-yellow-500"
                        />
                    </label>

                    {imagePreview && (
                        <div className="overflow-hidden rounded-xl border border-slate-700">
                            <img
                                src={imagePreview}
                                alt={imageFile?.name || 'Selected product preview'}
                                className="h-48 w-full object-cover"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 sm:w-auto"
                    >
                        {isSubmitting ? 'Uploading...' : 'Save specification'}
                    </button>

                    {state.success && (
                        <p className="text-sm text-emerald-400" role="status">
                            Specification submitted successfully.
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}