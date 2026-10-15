import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSpecifications } from '@/lib/api/getSpecifications';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Product Specifications | Rajasthanwalls Infratech',
    description:
        'Explore detailed specifications and product images for precast cement panels, RCC columns, and compound walls.',
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917820879777';

export default async function SpecificationsPage() {
    const specifications = await getSpecifications();
    const whatsappHref = WHATSAPP
        ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi, I'd like a quote based on your product specifications.")}`
        : null;

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
            <Navbar />

            <section className="border-b border-slate-800 bg-slate-900 px-4 py-14 text-center text-white sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Product Specifications
                    </h1>
                    <div className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 text-balance">
                        Explore detailed specifications for our precast RCC products.
                    </p>
                </div>
            </section>

            {specifications.length > 0 && (
                <nav
                    aria-label="Product specifications"
                    className="sticky top-20 z-20 border-b border-slate-200 bg-white/95 backdrop-blur"
                >
                    <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
                        {specifications.map(({ slug, specificationName }) => (
                            <li key={slug} className="shrink-0">
                                <a
                                    href={`#${slug}`}
                                    className="inline-block rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-slate-900"
                                >
                                    {specificationName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            <main className="mx-auto w-full max-w-7xl grow space-y-10 px-4 py-12 sm:px-6 lg:px-8">
                {specifications.length > 0 ? (
                    specifications.map((specification) => (
                        <section
                            key={specification.id}
                            id={specification.slug}
                            aria-labelledby={`${specification.slug}-title`}
                            className="scroll-mt-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 p-6 md:grid-cols-2 md:p-8">
                                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100">
                                    <Image
                                        src={specification.image}
                                        alt={specification.specificationName}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                                        {specification.label}
                                    </span>
                                    <h2
                                        id={`${specification.slug}-title`}
                                        className="text-3xl font-bold text-slate-800"
                                    >
                                        {specification.specificationName}
                                    </h2>
                                    <p className="text-lg leading-relaxed text-slate-600">
                                        {specification.description}
                                    </p>

                                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-sm shadow-sm">
                                        <table className="w-full border-collapse text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-100 text-slate-700">
                                                    <th scope="col" className="px-4 py-2.5 font-semibold">
                                                        Specification
                                                    </th>
                                                    <th scope="col" className="px-4 py-2.5 font-semibold">
                                                        Standard Dimension
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 text-slate-600">
                                                {specification.specifications.map((item, index) => (
                                                    <tr key={`${item.label}-${index}`}>
                                                        <th
                                                            scope="row"
                                                            className="px-4 py-2.5 text-left font-medium text-slate-700"
                                                        >
                                                            {item.label}
                                                        </th>
                                                        <td className="px-4 py-2.5 font-mono text-slate-800">
                                                            {item.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))
                ) : (
                    <p className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-600">
                        Product specifications are being updated. Please check back soon.
                    </p>
                )}

                <section className="rounded-2xl bg-slate-900 px-6 py-12 text-center sm:px-10">
                    <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                        Need a custom size or a quote?
                    </h2>
                    <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 text-balance">
                        Tell us your site requirements and we&apos;ll recommend the right panel, column, or wall system.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Send Enquiry
                        </Link>
                        {whatsappHref && (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                WhatsApp Quote
                            </a>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
