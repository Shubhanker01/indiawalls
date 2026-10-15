'use client';

import { useState } from 'react';
import { Plus, Trash2, GalleryVertical } from 'lucide-react';
import AddClientForm from './AddClientForm';
import DeleteClientForm from './DeleteClientForm';
import ClientCatalog from './ClientCatalog';

const MODES = [
    { id: 'add', label: 'Add a new client', icon: Plus },
    { id: 'delete', label: 'Delete a client', icon: Trash2 },
    { id: 'catalog', label: 'Show Catalog', icon: GalleryVertical },
];

export default function ClientsManager() {
    const [mode, setMode] = useState('add');
    const activeMode = MODES.find((item) => item.id === mode);
    const ActiveIcon = activeMode.icon;

    return (
        <>
            <header className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                    Admin Panel
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                    Client management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Add or delete clients displayed in the client section.
                </p>
            </header>

            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Client actions">
                {MODES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`client-mode-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={mode === id}
                        aria-controls="client-mode-panel"
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
                id="client-mode-panel"
                role="tabpanel"
                aria-labelledby={`client-mode-${mode}`}
                className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6"
            >
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ActiveIcon className="h-5 w-5 text-yellow-400" />
                    {mode === 'catalog' ? 'Clients catalog' : activeMode.label}
                </h2>
                {mode === 'add' ? (
                    <AddClientForm />
                ) : mode === 'delete' ? (
                    <DeleteClientForm />
                ) : (
                    <ClientCatalog />
                )}
            </section>
        </>
    );
}
