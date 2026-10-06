import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const ProductCementPlank = dynamic(() => import('@/components/ProductCementPlank'));
const ColumnProductPage = dynamic(() => import('@/components/ColumnProductPage'));
const CompoundWallPage = dynamic(() => import('@/components/CompoundWallPage'));

export const metadata = {
    title: 'Product Specifications & 3D Models | Indiawalls',
    description:
        'Explore detailed specifications and interactive 3D models for precast cement panels, RCC columns, and compound walls.',
};


const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// Labels for the quick-jump bar. Edit these to match each product's actual title.
const specSections = [
    { id: 'cement-sets', label: 'Cement Sets (Pannel)', Component: ProductCementPlank },
    { id: 'rcc-columns', label: 'RCC Columns', Component: ColumnProductPage },
    { id: 'compound-walls', label: 'Compound Walls', Component: CompoundWallPage },
];

export default function SpecificationsPage() {
    const whatsappHref = WHATSAPP
        ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I'd like a quote based on your product specifications.")}`
        : null;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
            <Navbar />

            {/* Banner */}
            <section className="border-b border-slate-800 bg-slate-900 px-4 py-14 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Product Specifications</h1>
                    <div className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 text-balance">
                        Explore interactive 3D models and detailed specifications for our precast RCC products.
                    </p>
                </div>
            </section>

            {/* Sticky quick-jump bar (pure anchor links, no JS) */}
            <nav
                aria-label="Product specifications"
                className="sticky top-20 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"
            >
                <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
                    {specSections.map(({ id, label }) => (
                        <li key={id} className="shrink-0">
                            <a
                                href={`#${id}`}
                                className="inline-block rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-900"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="mx-auto w-full max-w-7xl grow space-y-10 px-4 py-12 sm:px-6 lg:px-8">
                {specSections.map(({ id, label, Component }) => (
                    <section
                        key={id}
                        id={id}
                        aria-label={label}
                        className="scroll-mt-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                        <Component />
                    </section>
                ))}

                {/* Next step */}
                <section className="rounded-2xl bg-slate-900 px-6 py-12 text-center sm:px-10">
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Need a custom size or a quote?</h2>
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 text-balance">
                        Tell us your site requirements and we&apos;ll recommend the right panel, column, or wall system.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Send Enquiry
                        </Link>
                        {whatsappHref && (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                WhatsApp Quote
                            </a>
                        )}
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-800 bg-slate-900 py-8 text-md text-slate-400">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
                    <div>
                        <p className="font-semibold text-slate-300">RajasthanWall Manufacturing Unit</p>
                        <p className="mt-1">Near Gyan Sagar, Alampur, Kotkasim, Rajasthan.</p>
                    </div>
                    <p className="text-slate-500">Copyright © 2026 RajasthanWall. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}