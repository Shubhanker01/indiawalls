import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Contact Us | Indiawalls Infratech - Get Free Site Estimate',
    description:
        'Get in touch with Indiawalls Infratech for factory quotes on precast boundary walls, RCC fencing poles, chainlink mesh, and paver blocks. Call +91 7820879777.',
};

const contactDetails = [
    {
        icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        title: 'Phone & Direct Call',
        value: '+91 7820879777',
        href: 'tel:7820879777',
        actionText: 'Call Immediately',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
        ),
        title: 'WhatsApp Inquiry',
        value: '+91 7820879777',
        href: 'https://wa.me/917820879777?text=Hi%20Indiawalls,%20I%20want%20to%20get%20a%20quote%20for%20my%20boundary%20project.',
        actionText: 'Chat on WhatsApp',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        title: 'Email Sales Desk',
        value: 'info@indiawalls.in',
        href: 'mailto:info@indiawalls.in',
        actionText: 'Send Email',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Factory & Head Office',
        value: 'Indiawalls Infratech, Industrial Area, Rajasthan / NCR, India',
        href: '#map-section',
        actionText: 'View Location',
    },
];

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            {/* 1. Header Section */}
            <section className="bg-slate-900 text-white pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-yellow-500/30">
                        Get Direct Factory Rates
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Contact Indiawalls Infratech
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Need a site survey, custom product dimensions, or direct factory pricing for your project? Connect with our technical team today.
                    </p>
                </div>
            </section>

            {/* 2. Quick Contact Cards */}
            <section className="relative -mt-10 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {contactDetails.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg flex flex-col justify-between hover:border-yellow-500 transition duration-200"
                        >
                            <div>
                                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-slate-900 font-bold text-base mb-4 break-words">
                                    {item.value}
                                </p>
                            </div>
                            <a
                                href={item.href}
                                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-yellow-600 hover:text-yellow-700 transition"
                            >
                                <span>{item.actionText}</span>
                                <span>→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Main Inquiry Form & Business Info Grid */}
            <section className="py-20 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Contact Form (8 cols) */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                            Request Project Quote
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Fill in your requirements below to receive a detailed cost estimate within 24 hours.
                        </p>
                    </div>

                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Your Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Rahul Sharma"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Phone / Mobile Number *
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 9876543210"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Product Category
                            </label>
                            <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition">
                                <option>Precast Concrete Boundary Wall</option>
                                <option>RCC Fencing Poles</option>
                                <option>Chainlink Mesh Fencing</option>
                                <option>Interlocking Paver Blocks</option>
                                <option>Multiple / Turnkey Project</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Approximate Area / Length
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 500 Running Feet"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Site Location & Specific Requirements
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Specify delivery city/location, required wall height (e.g., 6ft or 8ft), or preferred installation schedule..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                            ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base"
                            >
                                Submit Inquiry
                            </button>
                        </div>
                    </form>
                </div>

                {/* Business Hours & Direct Info (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl">
                        <h3 className="text-xl font-bold mb-4 text-yellow-400">Business & Dispatch Hours</h3>
                        <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
                            Our technical consultants and dispatch teams operate during the following business hours:
                        </p>

                        <ul className="space-y-3 text-xs sm:text-sm border-t border-slate-800 pt-4">
                            <li className="flex justify-between text-slate-300">
                                <span className="font-semibold text-slate-400">Monday – Saturday:</span>
                                <span className="font-bold text-white">9:00 AM – 7:00 PM</span>
                            </li>
                            <li className="flex justify-between text-slate-300">
                                <span className="font-semibold text-slate-400">Sunday:</span>
                                <span className="font-bold text-yellow-400">Site Visits by Appointment</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-3xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Urgent Project Requirement?</h3>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                            For urgent bulk dispatches or immediate site inspections across Rajasthan, Delhi NCR, and Haryana, call our technical sales desk directly.
                        </p>
                        <a
                            href="tel:7820879777"
                            className="inline-flex items-center justify-center gap-2 bg-yellow-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition text-sm w-full text-center"
                        >
                            📞 Call Sales Manager (+91 7820879777)
                        </a>
                    </div>
                </div>
            </section>

            {/* 4. Map Section Placeholder */}
            <section id="map-section" className="py-12 px-4 max-w-7xl mx-auto">
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="w-full h-80 bg-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500 text-center p-6">
                        <span className="text-4xl mb-2">📍</span>
                        <p className="font-bold text-slate-800 mb-1">Indiawalls Infratech Factory & Yard</p>
                        <p className="text-xs text-slate-500 max-w-md">
                            Industrial Manufacturing Unit, Serving Rajasthan, Delhi NCR, Haryana, and Neighboring Regions.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}