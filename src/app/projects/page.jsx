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
            {/* <section className="bg-slate-900 text-white pt-12 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <span className="inline-block bg-yellow-500/20 text-yellow-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-yellow-500/30">
                        Our Portfolio
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Completed Project Gallery
                    </h1>
                    <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Take a look at our recent on-site installations across industrial sites, commercial complexes, farmland boundaries, and infrastructure projects.
                    </p>
                </div>
            </section>

            {/* 2. 9-Photo Project Grid */}
            
                           

            {/* 3. Call to Action Banner */}
            <section className="bg-slate-900 text-white py-14 px-4 border-t border-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">Have a Project in Mind?</h2>
                    <p className="text-slate-400 text-base sm:text-lg mb-8">
                        Get site-specific recommendations, material estimates, and competitive factory rates for your site boundary.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact"
                            className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                        >
                            Get Free Site Estimate
                        </Link>
                        <a
                            href="tel:9950711475"
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition duration-200 text-sm sm:text-base flex items-center gap-2"
                        >
                            Call +91 9950711475
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}