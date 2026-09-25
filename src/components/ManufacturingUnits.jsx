'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const units = [
    {
        city: 'Kotkasim Unit',
        region: 'Rajasthan',
        address: 'Kotkasim industrial area, Rajasthan',
        geo: 'Kotkasim, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Kotkasim,Rajasthan',
    },
    {
        city: 'Tapukara Unit',
        region: 'Rajasthan',
        address: 'Tapukara industrial area, Rajasthan',
        geo: 'Tapukara, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Tapukara,Rajasthan',
    },
    {
        city: 'Alwar Unit',
        region: 'Rajasthan',
        address: 'Alwar industrial area, Rajasthan',
        geo: 'Alwar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Alwar,Rajasthan',
    },
    {
        city: 'Ringus Unit',
        region: 'Rajasthan',
        address: 'Ringus industrial area, Rajasthan',
        geo: 'Ringus, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ringus,Rajasthan',
    },
    {
        city: 'Ramgarh Unit',
        region: 'Rajasthan',
        address: 'Ramgarh industrial area, Rajasthan',
        geo: 'Ramgarh, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ramgarh,Rajasthan',
    },
    {
        city: 'Faridabad Unit',
        region: 'Haryana / NCR Zone',
        address: 'Faridabad industrial area, Haryana',
        geo: 'Faridabad, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Faridabad,Haryana',
    },
    {
        city: 'Bahadurgarh Unit',
        region: 'Haryana / NCR Zone',
        address: 'Bahadurgarh industrial area, Haryana',
        geo: 'Bahadurgarh, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Bahadurgarh,Haryana',
    },
    {
        city: 'Palwal Unit',
        region: 'Haryana / NCR Zone',
        address: 'Palwal industrial area, Haryana',
        geo: 'Palwal, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Palwal,Haryana',
    },
    {
        city: 'Govindgarh Unit',
        region: 'Rajasthan',
        address: 'Govindgarh industrial area, Rajasthan',
        geo: 'Govindgarh, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Govindgarh,Rajasthan',
    },
    {
        city: 'Mundawar Unit',
        region: 'Rajasthan',
        address: 'Mundawar industrial area, Rajasthan',
        geo: 'Mundawar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Mundawar,Rajasthan',
    },
];

export default function ManufacturingUnits() {
    const [activeIdx, setActiveIdx] = useState(2); // Default centered around a unit

    return (
        <section className="py-20 border-y border-slate-200 overflow-hidden bg-slate-50" id="locations">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-block">
                        Factory Network
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                        Our Manufacturing Sites
                    </h2>
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                        Our manufacturing units are strategically located across key industrial zones to ensure rapid delivery.
                    </p>
                    <p className="text-amber-700 text-sm font-semibold">
                        Site visit available within two hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <a
                            href="tel:+919950711475"
                            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 shadow-sm"
                        >
                            Call Now
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 shadow-sm"
                        >
                            Enquire Now
                        </a>
                    </div>
                </AnimatedSection>

                {/* SEMI-STACKED FAN DECK CONTAINER */}
                <div className="relative w-full h-[460px] flex items-center justify-center">
                    <div className="relative w-full max-w-md h-full flex items-center justify-center">
                        {units.map((unit, idx) => {
                            const offset = idx - activeIdx;
                            const isActive = idx === activeIdx;

                            // Limit stack rendering range to 3 units left and 3 units right for clean performance
                            if (Math.abs(offset) > 3) return null;

                            // Calculate bilateral offsets (negative for left stack, positive for right stack)
                            const xOffset = offset * 110;
                            const yOffset = Math.abs(offset) * 28;
                            const rotation = offset * 6;
                            const scale = isActive ? 1.05 : 1 - Math.abs(offset) * 0.08;
                            const zIndex = 30 - Math.abs(offset);
                            const opacity = isActive ? 1 : Math.max(0.35, 1 - Math.abs(offset) * 0.25);

                            return (
                                <motion.div
                                    key={idx}
                                    initial={false}
                                    animate={{
                                        x: xOffset,
                                        y: yOffset,
                                        rotate: rotation,
                                        scale: scale,
                                        opacity: opacity,
                                    }}
                                    style={{
                                        zIndex: zIndex,
                                        willChange: "transform, opacity"
                                    }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 25,
                                    }}
                                    onClick={() => setActiveIdx(idx)}
                                    className={`absolute w-full h-[360px] rounded-2xl p-7 border flex flex-col justify-between cursor-pointer select-none ${isActive
                                        ? 'bg-white border-amber-500 shadow-xl ring-2 ring-amber-500/20'
                                        : 'bg-slate-100 border-slate-300 shadow-sm hover:bg-white'
                                        }`}
                                >
                                    {/* CARD HEADER */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center text-xl font-bold">
                                                📍
                                            </span>
                                            <span className="text-xs font-mono font-medium text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                                                {unit.region}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                                                {unit.city}
                                            </h3>
                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {unit.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CARD FOOTER */}
                                    <div className="pt-4 border-t border-slate-200 space-y-3">
                                        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                                            <span className="text-amber-500">🌐</span>
                                            <span>{unit.geo}</span>
                                        </div>

                                        <a
                                            href={unit.mapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm"
                                        >
                                            <span>Open in Google Maps</span>
                                            <span>↗</span>
                                        </a>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* BOTTOM NAVIGATION CHIPS / INDICATORS */}
                <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-4xl mx-auto">
                    {units.map((unit, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${activeIdx === idx
                                ? 'bg-slate-900 text-amber-400 border-slate-900 shadow'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400 hover:text-amber-700'
                                }`}
                        >
                            {unit.city.replace(' Unit', '')}
                        </button>
                    ))}
                </div>

            </div>
        </section>
    );
}