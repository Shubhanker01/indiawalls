import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Heavy Duty Interlocking Paver Blocks & Concrete Tiles | Indiawalls',
    description:
        'High-strength interlocking concrete paver blocks in Zig-Zag, I-Shape, Hexagonal, and Rectangular patterns for driveways, parking spaces, petrol pumps, and industrial yards.',
};

const paverTypes = [
    {
        name: 'I-Shape / Dumbbell Paver',
        thickness: '60mm - 80mm',
        bestFor: 'Heavy Traffic, Industrial Yards & Petrol Pumps',
        desc: 'Provides maximum interlocking mechanical lock. Highly resistant to wheel rotation friction from heavy trucks and buses.',
        badge: 'Heavy Duty',
    },
    {
        name: 'Zig-Zag Paver Block',
        thickness: '60mm - 80mm',
        bestFor: 'Highways, Commercial Parking & Port Areas',
        desc: 'Classic wave edges provide four-way continuous locking to prevent shifting under continuous vehicular loads.',
        badge: 'Popular',
    },
    {
        name: 'Hexagonal / Honeycomb Paver',
        thickness: '50mm - 60mm',
        bestFor: 'Parks, Walkways & Residential Driveways',
        desc: 'Aesthetic geometric finish offering multi-directional load distribution and easy replacement during maintenance.',
        badge: 'Aesthetic',
    },
    {
        name: 'Grass Paver Block',
        thickness: '60mm - 80mm',
        bestFor: 'Eco-Friendly Parking, Lawns & Landscaping',
        desc: 'Hollow cell concrete design that allows grass growth while enabling rainwater harvesting and soil protection.',
        badge: 'Eco-Friendly',
    },
];

const technicalSpecs = [
    { feature: 'Compressive Strength', detail: 'M-30 to M-50 Grade Concrete' },
    { feature: 'Thickness Range', detail: '50 mm, 60 mm, 80 mm & 100 mm' },
    { feature: 'Manufacturing Process', detail: 'High-Frequency Hydraulic Pressure Compaction' },
    { feature: 'Water Absorption', detail: 'Less than 5% (IS 15658 Compliant)' },
    { feature: 'Abrasion Resistance', detail: 'High Wear-Resistant Upper Layer' },
    { feature: 'Available Colors', detail: 'Grey, Red, Yellow, Black & Customized Shades' },
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

export default function PaverBlocksPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            {/* 1. Hero Section */}
            <section className="bg-slate-900 text-white pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-emerald-500/30">
                                Paving & Flooring Solutions
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                                High-Strength Interlocking Paver Blocks
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                Factory-pressed heavy-duty concrete paver blocks engineered for extreme vehicular load, all-weather durability, and rapid installation across commercial driveways, petrol pumps, and public walkways.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#enquiry-form"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                                >
                                    Request Price List
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

                        {/* Main Product Image Banner */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 h-80 sm:h-96">
                            <img
                                src="/images/pavers/paver.webp"
                                alt="Heavy Duty Interlocking Concrete Paver Blocks"
                                className="w-full h-full"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs text-slate-300">
                                <span>Hydraulic Vibration Pressed</span>
                                <span className="text-emerald-400 font-semibold">M-30 to M-50 Grade</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Key Benefits */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Choose Interlocking Pavers?</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Superior alternative to traditional asphalt and plain concrete flooring with zero curing downtime and instant usability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🚛
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Heavy Load Bearing</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Engineered to handle high point-loads, heavy trucks, container movements, and continuous traffic without cracking.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🔧
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Easy Underground Access</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Blocks can be easily lifted for underground pipe/cable repairs and reinstated without leaving messy patches or cuts.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🌧️
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Anti-Skid & Weather Proof</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Textured surface ensures high friction even during heavy rains, reducing accidents in steep driveways and parking ramps.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Available Types & Patterns */}
            <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Available Shapes & Patterns</h2>
                            <p className="text-slate-600 text-sm">Choose the ideal interlocking profile for your specific traffic requirement.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {paverTypes.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                                            {item.thickness}
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

            {/* 4. Technical Specs & Installation Steps */}
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

                {/* Installation Steps */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">How Precast Walls Are Made</h2>
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

            {/* 5. Quick Quote / Estimate Form */}
            <section id="enquiry-form" className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Calculate Your Paver Block Requirement</h2>
                        <p className="text-slate-400 text-sm">
                            Submit your area dimensions (in Sq. Ft. or Sq. Meter) for an accurate price estimate per square foot.
                        </p>
                    </div>

                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your Name"
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
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Total Area (Sq. Ft.)</label>
                            <input
                                type="number"
                                placeholder="e.g., 1500 Sq. Ft."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Preferred Block Thickness</label>
                            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm">
                                <option>60mm (Residential / Light Commercial)</option>
                                <option>80mm (Heavy Vehicles / Petrol Pumps)</option>
                                <option>50mm (Walkways & Footpaths)</option>
                                <option>Need Expert Recommendation</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Location & Details</label>
                            <textarea
                                rows="3"
                                placeholder="Enter city/site location and any preferred pattern or color choice..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base"
                            >
                                Get Cost Estimate
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}