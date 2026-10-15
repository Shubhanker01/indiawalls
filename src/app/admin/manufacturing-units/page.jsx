import ManufacturingUnitsManager from './ManufacturingUnitsManager';

export const dynamic = 'force-dynamic';

export default function AdminManufacturingUnitsPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <ManufacturingUnitsManager />
            </div>
        </main>
    );
}
