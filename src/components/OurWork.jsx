'use client';

import AnimatedSection from './AnimatedSection';

const projects = [
    {
        title: 'Industrial Area, Chopanki, Bhiwadi',
        image: '/IndustrialAreaBhiwadi.webp',
    },
    {
        title: 'Paver Block Installation, M.I.A Alwar',
        image: '/MIAAlwar.webp',
    },
    {
        title: 'Precast Boundary Wall, Sector 74, Gurugram',
        image: '/Gurugram.webp',
    },
    {
        title: 'Compound Wall Project, Dayalpur, Faridabad',
        image: '/Dayalpur.webp',
    },
    {
        title: 'Mahwa, Near Sikandra, Rajasthan',
        image: '/Mahwa.webp',
    },
    {
        title: 'Alwar, Rajasthan',
        image: '/Alwar.webp',
    }
];

export default function OurWorkMinimal() {
    return (
        <section className="py-20" id="our-work">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION TITLE */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                        Our Work
                    </h2>
                </AnimatedSection>

                {/* IMAGE CAROUSEL / GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((item, idx) => (
                        <AnimatedSection
                            key={idx}
                            delay={0.15 + idx * 0.07}
                            className="bg-white/90 border border-slate-200 rounded-2xl overflow-hidden group shadow-lg transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-48 sm:h-64 overflow-hidden bg-slate-950">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full object-cover
                                    group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-4 bg-white/90 text-center">
                                <p className="text-sm font-semibold text-slate-800">
                                    {item.title}
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}