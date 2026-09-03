import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Project Gallery & Completed Works | Indiawalls Infratech',
    description:
        'Explore our portfolio of completed precast boundary walls, RCC fencing poles, chainlink fencing, and paver block installations across industrial, commercial, and residential sites.',
};

const projects = [
    {
        id: 1,
        title: 'Industrial Factory Boundary Wall',
        category: 'Precast Walls',
        location: 'Bhiwadi Industrial Zone, Rajasthan',
        image: '/PreCastWallImage.webp',
        description:
            '1,200 running feet of 8ft high precast concrete boundary wall with heavy reinforcement for long-term perimeter security.',
    },
    {
        id: 2,
        title: 'Solar Power Plant Boundary Fencing',
        category: 'Fencing Poles',
        location: 'Bhadla, Rajasthan',
        image: '/images/fencing poles/fencing pole.webp',
        description:
            'Installation of 8ft RCC pre-stressed fencing poles with pre-drilled wire slots across a 15-acre solar farm perimeter.',
    },
    {
        id: 3,
        title: 'High-Density GI Chainlink Perimeter',
        category: 'Chainlink',
        location: 'Gurugram Commercial Hub',
        image: '/images/fencing poles/chainlink.webp',
        description:
            'Heavy-zinc hot-dip galvanized chainlink mesh fence installed on custom steel posts for low wind-resistance and high visibility.',
    },
    {
        id: 4,
        title: 'Heavy Vehicle Interlocking Paver Driveway',
        category: 'Paver Blocks',
        location: 'Logistics Park, Haryana',
        image: '/PaverBlocks.webp',
        description:
            '80mm zig-zag heavy-duty interlocking paver block installation engineered for heavy freight truck movement and high loads.',
    },
    {
        id: 5,
        title: 'Farmland Agricultural Boundary Fence',
        category: 'Fencing Poles',
        location: 'Alwar, Rajasthan',
        image: '/Alwar.webp',
        description:
            'Precast RCC poles combined with 7-line barbed wire setup to protect agricultural crops against cattle entry.',
    },
    {
        id: 6,
        title: 'Residential Society Boundary Wall',
        category: 'Precast Walls',
        location: 'Noida Extension, UP',
        image: '/PreCastWallImage.webp',
        description:
            'Decorative textured precast concrete panels designed for rapid installation with an elegant architectural look.',
    },

];

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            {/* 1. Header Section */}
            <section className="bg-slate-900 text-white pt-12 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-emerald-500/30">
                        Our Portfolio
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Completed Project Gallery
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Take a look at our recent on-site installations across industrial sites, commercial complexes, farmland boundaries, and infrastructure projects.
                    </p>
                </div>
            </section>

            {/* 2. 9-Photo Project Grid */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                        >
                            {/* Image Container */}
                            <div>
                                <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg border border-slate-700">
                                        {project.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                                        <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{project.location}</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition">
                                        {project.title}
                                    </h2>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
                                <span className="text-emerald-600 font-bold">100% Quality Execution</span>
                                <Link
                                    href="/contact"
                                    className="text-slate-800 hover:text-emerald-600 transition flex items-center gap-1"
                                >
                                    Request Similar
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Call to Action Banner */}
            <section className="bg-slate-900 text-white py-14 px-4 border-t border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have a Project in Mind?</h2>
                    <p className="text-slate-400 text-sm sm:text-base mb-8">
                        Get site-specific recommendations, material estimates, and competitive factory rates for your site boundary.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                        >
                            Get Free Site Estimate
                        </Link>
                        <a
                            href="tel:7820879777"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition duration-200 text-sm sm:text-base flex items-center gap-2"
                        >
                            Call +91 7820879777
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}