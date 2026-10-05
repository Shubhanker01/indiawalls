'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/why-us', label: 'Why Us' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
];

const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/indiawallsofficial/' },
    { name: 'Instagram', href: 'https://www.instagram.com/indiawallsofficial/' },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UCKtbPe4q1zKgwNjKLMLK-RQ' },
];

function SocialIcons({ className = '' }) {
    return (
        <div className={className}>
            {socialLinks.map(({ name, href }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="text-slate-100 transition-colors hover:text-yellow-400"
                >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        {name === 'Facebook' && (
                            <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
                        )}
                        {name === 'Instagram' && (
                            <>
                                <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="17.5" cy="6.5" r="1.2" />
                            </>
                        )}
                        {name === 'YouTube' && (
                            <>
                                <path d="M23 7.1a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.9 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.9 31 31 0 0 0-.5-4.9Z" />
                                <path d="m9.8 15.5 5.9-3.5-5.9-3.5v7Z" fill="#111827" />
                            </>
                        )}
                    </svg>
                </a>
            ))}
        </div>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href) =>
        href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(`${href}/`);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="sticky w-full top-0 z-100 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-2xl font-extrabold tracking-tight text-slate-100 sm:text-4xl"
                    onClick={closeMenu}
                >
                    Rajasthan<span className="text-yellow-400">Walls</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-5 lg:gap-6 font-medium text-slate-100">
                    <div className="flex items-center gap-5 lg:gap-6">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`transition-all duration-200 relative ${active
                                        ? 'text-yellow-400 font-semibold'
                                        : 'text-slate-100 hover:text-yellow-400'
                                        } text-xl`}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                    <SocialIcons className="flex items-center gap-3" />
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
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-200 origin-center ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-2'
                                }`}
                        />
                        {/* Middle Line */}
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-current rounded-full transition-all duration-200 ${isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                                }`}
                        />
                        {/* Bottom Line */}
                        <span
                            className={`absolute left-0 top-1/2 w-full h-0.5 bg-current rounded-full transition-transform duration-200 origin-center ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-2'
                                }`}
                        />
                    </div>
                </button>
            </div>

            {/* Mobile Dropdown Drawer with Smooth Scale & Fade Animation */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-200 ease-in-out bg-gray-900 border-b border-gray-800 will-change-[transform,opacity] ${isOpen ? 'scale-y-100 opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none absolute w-full'
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
                                className={`block px-4 py-2.5 rounded-lg font-medium text-base text-center transition-all duration-200 ${active
                                    ? 'text-yellow-400 font-semibold translate-x-1'
                                    : 'text-slate-100 hover:text-yellow-400 hover:bg-gray-800/30 hover:translate-x-1'
                                    }`}
                                aria-current={active ? 'page' : undefined}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <SocialIcons className="flex items-center justify-center gap-6 py-3" />
                </div>
            </div>
        </nav>
    );
}