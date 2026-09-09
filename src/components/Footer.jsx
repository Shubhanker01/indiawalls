import Image from 'next/image';
import Link from 'next/link';

const socialLinks = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/indiawallsofficial/',
        icon: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTqwU52rqoMpbjhqrlJnyHG1TW_3INcsbijzOwnqeFCUAbjflzve8S-Kyz8rsg6auLGXZwtqTKUDJe8b6o',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/indiawallsofficial/',
        icon: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRHGSZ45SNiRtUmm9h5ktd96Flhz6cqZynRNLdpP9a-jl3Hz-IhUqQqO8wkWm77W9MxWQevYWpvNTuHkWc',
    },
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/company/indiawalls',
        icon: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSk0Mz3VQXhV9Uk8VBYLd9bhZL5t8uO68oF-kJi79ylTBQEvAF5lQbGIrFQJQPqqtcArLg2pDUP5SOP0rg',
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UCKtbPe4q1zKgwNjKLMLK-RQ',
        icon: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTY6V4898uUDwst1DMJ-lyJr4tkab2pRF9DuGrpoogUPUoBlpgTElt4D4212o8IJsLD7_cEmYemSVNgEnM',
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/917820879777',
        icon: 'https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSd9nNIBxHTxdnCyWyRIBfpTJfayy_saxhi3N1oNKcQlJkCothKfAkK21WZo1SoG9SgJOepoZljt5i7IwA',
    },
];

const productLinks = [
    { name: 'Precast RCC Boundary Wall', href: '/products' },
    { name: 'Folding Compound Wall', href: '/products' },
    { name: 'Interlocking Paver Blocks', href: '/products' },
    { name: 'Barbed Wire Fencing Poles', href: '/products' },
    { name: 'Designer Concrete Panels', href: '/products' },
];

const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Why Choose Us', href: '#why-us' },
    { name: 'Our Work', href: '#our-work' },
    { name: 'Manufacturing Units', href: '#locations' },
    { name: 'FAQs', href: '#faq' },
];

export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

                    {/* COLUMN 1: BRAND & ABOUT (4 COLS) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="items-center space-x-3 group inline-block">
                            <div className="relative shrink-0">
                                <Image
                                    src="/Logo-Indiawalls.svg"
                                    alt="Indiawalls Infratech Logo"
                                    className="object-contain"
                                    width={128}
                                    height={128}
                                />
                            </div>

                        </Link>

                        <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                            Indiawalls Infratech Private Limited is a leading manufacturer of high-strength precast RCC boundary walls, folding compound walls, and interlocking paver blocks serving industrial and commercial sites across Rajasthan and Delhi NCR.
                        </p>

                        {/* SOCIAL MEDIA LINKS */}
                        <div className="pt-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
                                Connect With Us
                            </p>
                            <div className="flex space-x-3">
                                {socialLinks.map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={item.name}
                                        className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center text-sm transition-all duration-200"
                                    >
                                        <Image
                                            src={item.icon}
                                            alt={`${item.name} Logo`}
                                            width={24}
                                            height={24}
                                            className="object-contain filter group-hover:brightness-110 transition-all"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: QUICK LINKS (2 COLS) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Company
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-amber-400 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN 3: PRODUCTS (3 COLS) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Products & Services
                        </h3>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            {productLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-amber-400 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUMN 4: HEAD OFFICE CONTACT (3 COLS) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                            Head Office
                        </h3>
                        <div className="space-y-3 text-xs sm:text-sm">
                            <p className="flex items-start space-x-3">
                                <span className="text-amber-500">📍</span>
                                <span>Khasra No. 251, 252, Tehsil Tapukara, Daganheri, Alwar, Rajasthan - 301707</span>
                            </p>
                            <p className="flex items-center space-x-3">
                                <span className="text-amber-500">📞</span>
                                <a href="tel:+917820879777" className="hover:text-amber-400 transition">
                                    +91 78208 79777
                                </a>
                            </p>
                            <p className="flex items-center space-x-3">
                                <span className="text-amber-500">✉️</span>
                                <a href="mailto:info@indiawalls.in" className="hover:text-amber-400 transition">
                                    info@indiawalls.in
                                </a>
                            </p>
                        </div>
                    </div>

                </div>

                {/* BOTTOM COPYRIGHT STRIP */}
                <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-200 space-y-4 sm:space-y-0">
                    <p>© {new Date().getFullYear()} Indiawalls Infratech Private Limited. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link href="#privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
                        <Link href="#terms" className="hover:text-slate-400 transition">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}