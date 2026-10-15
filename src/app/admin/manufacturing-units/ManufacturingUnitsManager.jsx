'use client';

import { useState } from 'react';
import { Loader2, MapPin, Pencil, Plus, Trash2, List } from 'lucide-react';
import { apiPost } from '@/lib/api/client';
import DeleteManufacturingUnitForm from './DeleteManufacturingUnitForm';
import UpdateManufacturingUnitForm from './UpdateManufacturingUnitForm';
import ManufacturingUnitsCatalog from './ManufacturingUnitsCatalog';

const FIELD_CLASS =
    'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-yellow-500';

const MODES = [
    { id: 'create', label: 'Add a new unit', icon: Plus },
    { id: 'update', label: 'Update', icon: Pencil },
    { id: 'delete', label: 'Delete', icon: Trash2 },
    { id: 'catalog', label: 'Show Catalog', icon: List },
];

const EMPTY_FORM = {
    city: '',
    region: '',
    address: '',
    url: '',
    latitude: '',
    longitude: '',
};

function AddManufacturingUnitForm() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function updateField(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSuccess('');

        setIsSaving(true);
        try {
            const payload = {
                city: form.city.trim(),
                region: form.region.trim(),
                address: form.address.trim(),
                url: form.url.trim(),
            };
            if (form.latitude) payload.latitude = form.latitude;
            if (form.longitude) payload.longitude = form.longitude;

            const data = await apiPost('/api/manufacturing-units', payload);

            setForm(EMPTY_FORM);
            setSuccess(`"${data.unit.city}" was added as a manufacturing unit.`);
        } catch (requestError) {
            setError(requestError.message || 'Manufacturing unit could not be created.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                    <h3 className="text-lg font-bold text-white">Manufacturing unit details</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        City is required. Address, region, map URL, latitude, and longitude are optional.
                    </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-sm font-medium text-slate-300">
                        City / unit name
                        <input
                            required
                            maxLength={120}
                            value={form.city}
                            onChange={(event) => updateField('city', event.target.value)}
                            placeholder="Jaipur Unit"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        State or region
                        <input
                            maxLength={120}
                            value={form.region}
                            onChange={(event) => updateField('region', event.target.value)}
                            placeholder="Rajasthan"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Address
                        <textarea
                            rows={2}
                            maxLength={300}
                            value={form.address}
                            onChange={(event) => updateField('address', event.target.value)}
                            placeholder="Industrial area, Jaipur"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300 sm:col-span-2">
                        Google Maps URL
                        <input
                            type="url"
                            maxLength={2000}
                            value={form.url}
                            onChange={(event) => updateField('url', event.target.value)}
                            placeholder="https://maps.google.com/?q=Jaipur"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        Latitude <span className="font-normal text-slate-500">(optional)</span>
                        <input
                            type="number"
                            min="-90"
                            max="90"
                            step="any"
                            value={form.latitude}
                            onChange={(event) => updateField('latitude', event.target.value)}
                            placeholder="26.9124"
                            className={FIELD_CLASS}
                        />
                    </label>
                    <label className="text-sm font-medium text-slate-300">
                        Longitude <span className="font-normal text-slate-500">(optional)</span>
                        <input
                            type="number"
                            min="-180"
                            max="180"
                            step="any"
                            value={form.longitude}
                            onChange={(event) => updateField('longitude', event.target.value)}
                            placeholder="75.7873"
                            className={FIELD_CLASS}
                        />
                    </label>
                </div>
            </section>

            <button
                type="submit"
                disabled={isSaving || !form.city.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                {isSaving ? 'Adding unit…' : 'Add manufacturing unit'}
            </button>
        </form>
    );
}

export default function ManufacturingUnitsManager() {
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
                    Manufacturing units
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Add, update, or delete manufacturing unit locations shown on the website.
                </p>
            </header>

            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Manufacturing unit actions">
                {MODES.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        id={`manufacturing-unit-mode-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={mode === id}
                        aria-controls="manufacturing-unit-mode-panel"
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
                id="manufacturing-unit-mode-panel"
                role="tabpanel"
                aria-labelledby={`manufacturing-unit-mode-${mode}`}
                className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6"
            >
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ActiveIcon className="h-5 w-5 text-yellow-400" />
                    {mode === 'catalog' ? 'Manufacturing units catalog' : activeMode.label}
                </h2>
                {mode === 'create' ? (
                    <AddManufacturingUnitForm />
                ) : mode === 'update' ? (
                    <UpdateManufacturingUnitForm />
                ) : mode === 'delete' ? (
                    <DeleteManufacturingUnitForm />
                ) : mode === 'catalog' ? (
                    <ManufacturingUnitsCatalog />
                ) : (
                    <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-sm text-slate-400">
                        {activeMode.label} functionality will be available here in a future update.
                    </p>
                )}
            </section>
        </>
    );
}
