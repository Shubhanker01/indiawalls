'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/why-us', label: 'Why Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
    { href: '/admin', label: 'Admin' },
];

export default function Navbar() {
    const pathname = usePathname();
    const isActive = (href) => href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

    return (
        <nav className="sticky top-0 z-50 bg-blue-950/95 backdrop-blur-md border-b border-blue-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="space-x-2">
                    <Image
                        src="/Logo-Indiawalls.svg"
                        alt="Indiawalls Infratech Logo"
                        priority
                        width={128}
                        height={128}
                    />
                </Link>

                <div className="hidden md:flex items-center space-x-8 font-medium text-slate-100">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={active ? 'text-yellow-400' : 'text-slate-100 hover:text-yellow-400 transition'}
                                aria-current={active ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

            </div>
        </nav>
    )
}