import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Admin | Indiawalls Infratech',
    description: 'Indiawalls Infratech admin page.',
};

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-yellow-600 mb-3">
                        Admin
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-600">
                        Welcome to the Indiawalls administration area.
                    </p>
                </div>
            </main>
        </div>
    );
}