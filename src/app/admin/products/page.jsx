import ProductsManager from './ProductsManager';

export const dynamic = 'force-dynamic';

export default function AdminProductsPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 sm:py-12">
            <div className="mx-auto max-w-5xl">
                <ProductsManager />
            </div>
        </main>
    );
}
