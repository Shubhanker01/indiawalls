import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
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

                <div className="hidden md:flex items-center space-x-8 font-medium text-slate-800">
                    <Link href="/" className="text-amber-800">Home</Link>
                    <Link href="/products" className="hover:text-amber-800 transition">Products</Link>
                    <Link href="/why-us" className="hover:text-amber-800 transition">Why Us</Link>
                    <Link href="/projects" className="hover:text-amber-800 transition">Projects</Link>
                    <Link href="/contact" className="hover:text-amber-800 transition">Contact</Link>
                </div>

                <a
                    href="#quote"
                    className="bg-amber-700 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
                >
                    Get Custom Quote
                </a>
            </div>
        </nav>
    )
}