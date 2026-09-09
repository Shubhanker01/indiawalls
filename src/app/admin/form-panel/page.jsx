'use client';

import { useState } from 'react';

export default function FormPanelPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                        Admin Panel
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Project Specification Form
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Add the details for a new project specification.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8"
                >
                    <div className="grid gap-6 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-300">
                            Project name
                            <input
                                name="projectName"
                                type="text"
                                required
                                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-300">
                            Client name
                            <input
                                name="clientName"
                                type="text"
                                required
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
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-300">
                        Project requirements
                        <textarea
                            name="requirements"
                            rows="5"
                            required
                            className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-yellow-500"
                        />
                    </label>

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-yellow-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 sm:w-auto"
                    >
                        Save specification
                    </button>

                    {submitted && (
                        <p className="text-sm text-emerald-400" role="status">
                            Specification submitted successfully.
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}