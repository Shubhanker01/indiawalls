import Link from 'next/link';
import Navbar from '@/components/Navbar'
export const metadata = {
    title: 'Heavy Duty RCC Concrete & Metal Fencing Poles | Indiawalls',
    description:
        'High-strength precast RCC concrete fencing poles and galvanized steel posts with pre-drilled holes for farmland, industrial boundaries, and solar power plants.',
};

const poleTypes = [
    {
        name: 'Precast RCC Concrete Poles',
        dimensions: '6 ft to 10 ft Height',
        bestFor: 'Agricultural Land, Solar Plants & Boundary Walls',
        desc: 'Manufactured using high-grade RCC with internal pre-stressed steel wire reinforcement. Features pre-drilled holes for quick wire stringing.',
        badge: 'Most Popular',
    },
    {
        name: 'T-Angle / Y-Angle Steel Posts',
        dimensions: 'Custom Sizes Available',
        bestFor: 'High-Security Concertina & Razor Wire Security',
        desc: 'Heavy-duty structural steel angles designed for mounting razor wire coils and extension arms over wall perimeters.',
        badge: 'High Security',
    },
    {
        name: 'GI Pipe & Tubular Poles',
        dimensions: '2" to 3" Diameter',
        bestFor: 'Sports Grounds, Commercial & Residential Lawns',
        desc: 'Galvanized iron poles engineered to resist rust and humidity, providing a clean aesthetic finish for chainlink mesh panels.',
        badge: 'Rust Proof',
    },
];

const technicalSpecs = [
    { feature: 'Pole Material', detail: 'M-30 Grade RCC / Galvanized Steel' },
    { feature: 'Reinforcement Wire', detail: 'High-Tensile Carbon Steel Wire (3mm - 4mm)' },
    { feature: 'Standard Heights', detail: '6 ft, 7 ft, 8 ft, 9 ft & 10 ft' },
    { feature: 'Wire Holes', detail: '5 to 8 Pre-Drilled Hole Slots' },
    { feature: 'Saltpeter (Shora) Resistance', detail: '100% Weather & Mineral Resistant' },
    { feature: 'Lifespan', detail: '30+ Years Zero Maintenance' },
];

const installationSteps = [
    {
        step: '01',
        title: 'Site Preparation',
        description: 'Excavation, ground levelling, and heavy compaction of the base soil to create a stable foundation.',
        image: '/images/pavers/site preparation.webp'
    },
    {
        step: '02',
        title: 'Material Delivery',
        description: 'Unloading factory-tested interlocking blocks and aggregates directly at the site location.',
        image: '/images/pavers/material delivery.webp'
    },
    {
        step: '03',
        title: 'Positioning',
        description: 'Precise hand-laying of paver blocks according to the specified design pattern and slope alignment.',
        image: '/images/pavers/positioning.webp'
    },
    {
        step: '04',
        title: 'Jointing & Sealing',
        description: 'Spreading fine jointing sand across the blocks followed by plate compactor locking and surface sealing.',
        image: '/images/pavers/jointing.webp'
    },
    {
        step: '05',
        title: 'Final Inspection',
        description: 'Comprehensive structural level check, edge restraint verification, and final cleaning before handoff.',
        image: '/images/pavers/final inspection.webp'
    }
];

export default function FencingPolesPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* 1. Hero Section */}
            <Navbar />
            <section className="bg-slate-900 text-white pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-emerald-500/30">
                                Structural Support Systems
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                                Heavy-Duty Concrete & Steel Fencing Poles
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                Pre-stressed RCC concrete poles and steel posts engineered with pre-drilled wire slots for secure, maintenance-free boundary definition across farmland, industrial sites, and solar parks.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#enquiry-form"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                                >
                                    Get Bulk Pricing
                                </a>
                                <a
                                    href="tel:7820879777"
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition duration-200 text-sm sm:text-base flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Call +91 7820879777
                                </a>
                            </div>
                        </div>

                        {/* Product Image Banner */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 h-80 sm:h-96">
                            <img
                                src="/images/fencing poles/fencing pole.webp"
                                alt="Precast Concrete Fencing Poles"
                                className="w-full h-full"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs text-slate-300">
                                <span>Pre-Stressed Steel Wire Inside</span>
                                <span className="text-emerald-400 font-semibold">Pre-Drilled Wire Holes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Key Benefits */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Choose Precast Fencing Poles?</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Long-lasting structural support that outperforms wooden posts and untreated metal pipes against soil moisture, termites, and harsh weather.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            📌
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Pre-Drilled Wire Holes</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Equipped with pre-molded hole slots to allow easy stringing of barbed wire, chainlink mesh, or concertina coils without drilling on-site.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🌧️
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Weather & Soil Resistant</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Impervious to saltpeter (shora), subterranean termites, and damp soil conditions, guaranteeing decades of service.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            💪
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Pre-Stressed Steel Core</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Reinforced internally with high-tensile carbon steel strands for flexural strength against animal impact and high winds.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Available Pole Variants */}
            <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Available Pole Types</h2>
                        <p className="text-slate-600 text-sm">Select the right structural support based on your property security requirement.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {poleTypes.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                                            {item.dimensions}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
                                    <p className="text-slate-600 text-xs sm:text-sm mb-4 leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">Best for:</span> {item.bestFor}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Technical Specs & 5-Step Installation Workflow */}
            <section className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Specifications Table */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Technical Specifications</h2>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {technicalSpecs.map((item, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                                        <td className="py-3.5 px-5 font-semibold text-slate-800 border-b border-slate-100">{item.feature}</td>
                                        <td className="py-3.5 px-5 text-slate-600 border-b border-slate-100">{item.detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 5-Step Installation Workflow */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">How Fencing Poles Are Made</h2>
                    <div className="space-y-4">
                        {installationSteps.map((step) => (
                            <div key={step.step} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                                <div className="flex gap-4 items-start flex-1">
                                    <span className="text-emerald-600 font-extrabold text-lg bg-emerald-50 px-3 py-1 rounded-lg">
                                        {step.step}
                                    </span>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-base mb-1">{step.title}</h3>
                                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                </div>

                                {step.image && (
                                    <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="w-full h-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>




                </div>
            </section>

            {/* 5. Contact & Inquiry Form */}
            <section id="enquiry-form" className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Request Pole Quotation</h2>
                        <p className="text-slate-400 text-sm">
                            Provide your required pole height and approximate quantity for an instant factory rate quote.
                        </p>
                    </div>

                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+91 9876543210"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Required Pole Height</label>
                            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm">
                                <option>6 Feet</option>
                                <option>7 Feet</option>
                                <option>8 Feet</option>
                                <option>10 Feet</option>
                                <option>Custom Dimension</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Approximate Pole Quantity</label>
                            <input
                                type="number"
                                placeholder="e.g. 100 Units"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Site Location & Requirements</label>
                            <textarea
                                rows="3"
                                placeholder="Enter city/delivery destination or mention wire type (barbed wire, chainlink)..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base"
                            >
                                Send Pole Enquiry
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}