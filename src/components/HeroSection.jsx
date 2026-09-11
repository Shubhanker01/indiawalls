'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const PrecastWallCanvas = dynamic(() => import('@/components/PrecastWallCanvas'), {
    ssr: false,
});

export default function HeroSection() {
    return (
        <section className="relative bg-slate-100 text-slate-900 py-16 lg:py-20 px-4 sm:px-8 overflow-hidden min-h-[580px]">

            {/* 1. 3D Rotating Dark Model Canvas */}
            <PrecastWallCanvas />

            {/* 2. Soft Light Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100/95 via-slate-100/70 to-transparent z-10 pointer-events-none" />

            {/* 3. Foreground Content */}
            <div className="relative z-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">

                {/* Left Column Text (Reduced Sizes) */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        ⚡ Over 2,000+ Projects Completed Across NCR & Rajasthan
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-slate-900">
                        High-Strength <span className="text-amber-600">Precast Boundary Walls</span> for Land & Industrial Security
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                        Fast, durable, and cost-effective readymade RCC boundary walls and paver blocks. Manufactured in state-of-the-art facilities and installed within days.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Link
                            href="/contact"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-center text-sm font-bold px-5 py-3 rounded-lg shadow-md transition"
                        >
                            Request Site Estimate
                        </Link>
                        <a
                            href="tel:+917820879777"
                            className="border border-slate-300 hover:border-slate-400 text-slate-800 text-center text-sm font-semibold px-5 py-3 rounded-lg transition bg-white/80 backdrop-blur-sm"
                        >
                            Call Engineer: 7820879777
                        </a>
                    </div>

                    {/* Micro Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-300/70 max-w-md">
                        <div>
                            <p className="text-xl font-extrabold text-amber-600">10+ Yrs</p>
                            <p className="text-[11px] text-slate-500">Industry Experience</p>
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-amber-600">50%</p>
                            <p className="text-[11px] text-slate-500">Faster Than Brickwork</p>
                        </div>
                        <div>
                            <p className="text-xl font-extrabold text-amber-600">Low</p>
                            <p className="text-[11px] text-slate-500">Maintenance Cost</p>
                        </div>
                    </div>
                </div>

                {/* Right Column Quick Lead Form Card */}
                <div className="lg:col-span-5 bg-white/95 backdrop-blur-md text-slate-900 rounded-xl p-5 sm:p-6 shadow-xl border border-slate-200" id="quote">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Get an Instant Price Quote</h3>
                    <p className="text-xs text-slate-500 mb-4">Fill out your land requirements and we will contact you in 2 hours.</p>

                    <form className="space-y-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Your Name</label>
                            <input type="text" placeholder="e.g. Rohit Kumar" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <div>
                            <label htmlFor="city-select" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Project Location</label>
                            <select id="city-select" name="city" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                                <option value="">Select City</option>
                                <option value="Bhiwadi">Bhiwadi / Chopanki</option>
                                <option value="Alwar">Alwar / MIA</option>
                                <option value="Gurugram">Gurugram / NCR</option>
                                <option value="Faridabad">Faridabad / Palwal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Length (Running Ft)</label>
                                <input type="number" placeholder="e.g. 500" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Height (Ft)</label>
                                <input id="height" name="height" type="number" placeholder="e.g. 6" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-3 rounded-lg transition shadow-md mt-2">
                            Get Estimated Pricing →
                        </button>
                    </form>
                </div>

            </div>
        </section>
    );
}