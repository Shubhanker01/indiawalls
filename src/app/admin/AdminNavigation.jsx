'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
    { label: 'Projects', href: '/admin/form-panel' },
    { label: 'Products', href: '/admin/products' },
    { label: 'Specifications', href: '/admin/specifications' },
    { label: 'Manufacturing units', href: '/admin/manufacturing-units' },
    { label: 'Clients', href: '/admin/clients' },
    { label: 'Blogs & testimonials', href: '/admin/content' },
];

export default function AdminNavigation({ children }) {
    const pathname = usePathname();

    if (pathname === '/admin') return children;

    return (
        <div className="min-h-screen bg-slate-950 lg:flex">
            <aside className="border-b border-slate-800 bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
                <div className="border-b border-slate-800 px-5 py-5">
                    <Link href="/admin/form-panel" className="text-lg font-bold tracking-tight text-white">
                        Rajasthan<span className="text-yellow-400">Walls</span>
                    </Link>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        Admin dashboard
                    </p>
                </div>
                <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
                    {navigationItems.map(({ label, href }) => {
                        const isActive = pathname === href || pathname.startsWith(`${href}/`);
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={isActive ? 'page' : undefined}
                                className={`shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? 'bg-yellow-500 text-slate-950'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
