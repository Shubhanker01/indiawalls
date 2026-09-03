import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'GI & PVC Coated Chainlink Mesh Fencing | Indiawalls',
    description:
        'High-tensile galvanized iron (GI) and PVC-coated chainlink mesh fencing for agricultural land, sports facilities, solar parks, and commercial property perimeters.',
};

const meshVariants = [
    {
        name: 'Hot-Dip Galvanized (GI) Chainlink',
        wireGauge: '8 Gauge to 12 Gauge (2.5mm - 4.0mm)',
        bestFor: 'Agricultural Fields, Industrial Grounds & Boundary Protection',
        desc: 'Heavy-zinc coated iron wire designed for high tensile resistance against impact and long-term exposure to outdoor weather.',
        badge: 'Heavy Duty',
    },
    {
        name: 'PVC Coated Chainlink Mesh',
        wireGauge: '10 Gauge to 12 Gauge Core + PVC',
        bestFor: 'Sports Arenas, Tennis Courts & Coastal Regions',
        desc: 'Galvanized inner core coated with weather-resistant PVC layer. Provides dual protection against rust, moisture, and chemical exposure.',
        badge: 'Corrosion Free',
    },
    {
        name: 'High-Security Small Mesh Chainlink',
        wireGauge: '10 Gauge (3.15mm)',
        bestFor: 'Solar Power Plants, Sub-stations & High-Security Zones',
        desc: 'Narrow diamond mesh aperture (1" to 1.5") engineered to prevent climb grips and tool insertion while maintaining high visibility.',
        badge: 'Anti-Climb',
    },
];

const technicalSpecs = [
    { feature: 'Wire Material', detail: 'Hot-Dip Galvanized Iron (GI) / PVC Coated GI' },
    { feature: 'Mesh Aperture Size', detail: '1", 1.5", 2", 2.5", 3", 4" Diamond Openings' },
    { feature: 'Wire Thickness (Gauge)', detail: '8 SWG (4.0mm) to 14 SWG (2.0mm)' },
    { feature: 'Roll Height Options', detail: '3 ft, 4 ft, 5 ft, 6 ft, 8 ft, 10 ft' },
    { feature: 'Zinc Coating Density', detail: 'Up to 275 g/m² Heavy Galvanization' },
    { feature: 'Standard Roll Length', detail: '50 Feet / 15 Meters per Roll' },
];

const installationSteps = [
    {
        step: '01',
        title: 'Site Preparation',
        desc: 'Clearing fence lines, marking corner post locations, and excavating footings for terminal posts.',
    },
    {
        step: '02',
        title: 'Material Delivery',
        desc: 'Transporting chainlink rolls, tension wires, strainers, and support poles directly to the site.',
    },
    {
        step: '03',
        title: 'Positioning',
        desc: 'Erecting corner and line posts plumb-level and unrolling mesh along the boundary path.',
    },
    {
        step: '04',
        title: 'Jointing & Sealing',
        desc: 'Stretching mesh with tension bars, securing bindings to line wires, and grouting post bases with concrete.',
    },
    {
        step: '05',
        title: 'Final Inspection',
        desc: 'Checking uniform wire tension, top rail alignment, and verifying fence rigidity across all spans.',
    },
];

export default function ChainlinkPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            {/* 1. Hero Section */}
            <section className="bg-slate-900 text-white pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto">


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-emerald-500/30">
                                Perimeter Protection Systems
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                                Galvanized & PVC Coated Chainlink Mesh
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                Durable, high-tensile diamond mesh fencing engineered for cost-effective boundary demarcation across agricultural land, solar parks, sports fields, and commercial properties.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#enquiry-form"
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                                >
                                    Get Instant Quote
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

                        {/* Product Banner */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 h-80 sm:h-96">
                            <img
                                src="/images/fencing poles/fencing pole.webp"
                                alt="Galvanized Chainlink Mesh Fencing"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-xl border border-slate-700 flex justify-between items-center text-xs text-slate-300">
                                <span>Heavy Zinc Coating (Up to 275 g/m²)</span>
                                <span className="text-emerald-400 font-semibold">Custom Mesh Heights</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Key Benefits */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Choose Indiawalls Chainlink Fencing?</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Versatile, open-weave structure that provides high visibility, low wind resistance, and long-term boundary security.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Rust & Weather Resistant</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Manufactured with high-grade hot-dip galvanized wire and UV-stabilized PVC coating to withstand continuous rain, humidity, and intense sunlight.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            📐
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Customizable Mesh Sizes</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Available in multiple mesh apertures (1" to 4") and wire gauge thicknesses tailored specifically to your site containment needs.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            💰
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Cost-Effective Boundary</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Delivers maximum per-linear-foot perimeter coverage at a fraction of the cost of solid concrete wall installations.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Product Variants */}
            <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Chainlink Mesh Options</h2>
                        <p className="text-slate-600 text-sm">Choose the ideal material coating and wire gauge for your location.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {meshVariants.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                                            {item.wireGauge}
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
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Installation Process</h2>
                    {/* 5-Step List */}
                    <div className="space-y-4">
                        {installationSteps.map((step) => (
                            <div
                                key={step.step}
                                className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4 items-start shadow-sm hover:border-emerald-500 transition"
                            >
                                <span className="text-emerald-600 font-extrabold text-lg bg-emerald-50 px-3 py-1 rounded-lg flex-shrink-0">
                                    {step.step}
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-base mb-1">{step.title}</h3>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Contact & Inquiry Form */}
            <section id="enquiry-form" className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Request Chainlink Estimate</h2>
                        <p className="text-slate-400 text-sm">
                            Provide total running feet, height requirement, and wire preference for an immediate factory quote.
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
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Coating Type</label>
                            <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm">
                                <option>Hot-Dip Galvanized (GI)</option>
                                <option>PVC Coated GI Wire</option>
                                <option>Not Sure (Need Advice)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Perimeter Length (Running Feet)</label>
                            <input
                                type="text"
                                placeholder="e.g. 500 Running Feet"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Location & Details</label>
                            <textarea
                                rows="3"
                                placeholder="Mention installation city, height requirement (e.g. 6 ft), or if support poles are needed..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
                            ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base"
                            >
                                Submit Quote Request
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}