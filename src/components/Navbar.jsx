'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/why-us', label: 'Why Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href) =>
        href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="space-x-2" onClick={closeMenu}>
                    <Image
                        src="/Logo-Indiawalls.svg"
                        alt="RajasthanWalls Infratech Logo"
                        priority
                        width={220}
                        height={59}
                        className="h-auto w-45 sm:w-55"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 font-medium text-slate-100">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-all duration-200 relative ${active
                                        ? 'text-yellow-400 font-semibold'
                                        : 'text-slate-100 hover:text-yellow-400'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Animated Mobile Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-md text-slate-100 hover:text-yellow-400 hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    aria-controls="mobile-menu"
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation menu"
                >
                    <div className="w-6 h-6 relative">
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-300 origin-center ${isOpen ? '-translate-y-1/2 rotate-45' : '-translate-y-1.75'
                                }`}
                        />
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-current rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                                }`}
                        />
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-300 origin-center ${isOpen ? '-translate-y-1/2 -rotate-45' : 'translate-y-1.75'
                                }`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Dropdown Drawer with Smooth Scale & Fade Animation */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-gray-900 border-b border-gray-800 ${isOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0 py-0 border-none'
                    }`}
            >
                <div className="px-4 space-y-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMenu}
                                className={`block px-4 py-2.5 rounded-lg font-medium text-base transition-all duration-200 ${active
                                        ? 'text-yellow-400 bg-gray-800/60 font-semibold translate-x-1'
                                        : 'text-slate-100 hover:text-yellow-400 hover:bg-gray-800/30 hover:translate-x-1'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}