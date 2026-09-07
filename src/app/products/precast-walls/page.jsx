import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
    title: 'Precast Concrete Boundary Walls & RCC Compound Walls | Indiawalls',
    description:
        'Explore high-strength precast RCC boundary walls, factory-cured concrete panels, and customized fencing solutions for residential, farm, and industrial properties.',
};

const manufacturingSteps = [
    {
        step: '01',
        title: 'Design & Engineering',
        description: 'Expert architects and engineers collaborate to create precise mold specifications based on project requirements.',
        image: '/images/precastwalls/design engineering.webp',
    },
    {
        step: '02',
        title: 'Mold Preparation & Steel Reinforcement',
        description: 'Precision steel molds are set up with high-tensile steel mesh rebar (M-30 to M-40 grade concrete specs).',
        image: '/images/precastwalls/mold preparation.webp',
    },
    {
        step: '03',
        title: 'Concrete Casting & Controlled Curing',
        description: 'High-grade concrete mix is poured and cured in a factory-controlled environment for 7 to 14 days.',
        image: '/images/precastwalls/curing.webp',
    },
    {
        step: '04',
        title: 'Quality Check & Delivery',
        description: 'Rigorous dimensional and load tests before safe dispatch to the installation site.',
        image: '/images/precastwalls/quality control.webp',
    },
];
const installationSteps = [
    { num: '1', name: 'Site Preparation & Ground Excavation' },
    { num: '2', name: 'RCC Pole Footing & Alignment' },
    { num: '3', name: 'Panel Slotting & Positioning' },
    { num: '4', name: 'Jointing, Sealing & Final Inspection' },
];

const technicalSpecs = [
    { feature: 'Concrete Grade', detail: 'M-30 to M-40 High-Strength RCC' },
    { feature: 'Reinforcement', detail: 'Pre-stressed / High-Tensile Rebar Mesh' },
    { feature: 'Available Heights', detail: '4 ft to 12+ ft (Customizable)' },
    { feature: 'Panel Thickness', detail: '50 mm to 150 mm' },
    { feature: 'Curing Method', detail: 'Factory Steam/Water Cured (7-14 Days)' },
    { feature: 'Durability / Lifespan', detail: '50+ Years (Weather & Fire Resistant)' },
];

export default function PrecastWallsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />
            <section className="bg-slate-900 text-white pt-12 pb-20 px-4">
                <div className="max-w-7xl mx-auto">


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block bg-emerald-500/20 text-yellow-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-yellow-500/30">
                                Boundary & Perimeter Solutions
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
                                Precast RCC Boundary & Compound Walls
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
                                Factory-manufactured reinforced concrete wall panels designed for quick assembly, superior durability, and low long-term maintenance across residential plots, farmhouses, and industrial land.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#enquiry-form"
                                    className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition duration-200 text-sm sm:text-base"
                                >
                                    Get Quick Quote
                                </a>
                                <a
                                    href="tel:7820879777"
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition duration-200 text-sm sm:text-base flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="0 0h24v24H0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Call +91 7820879777
                                </a>
                            </div>
                        </div>

                        {/* Product Image / Media Box */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 h-80 sm:h-96">
                            <img
                                src="/images/precastwalls/precast.webp"
                                alt="Precast Concrete Boundary Wall"
                                className="w-full h-full"
                            />
                            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300">
                                Factory Cured • Steel Reinforced • Rapid On-Site Setup
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Key Highlights / Benefits */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Choose Precast Concrete Walls?</h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Replacing traditional brick walls with ready-made reinforced concrete structures saves time, reduces total cost, and provides uniform structural stability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            ⚡
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Rapid Installation</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Installed up to 5x faster than brick masonry. Completed within a few days without waiting for wet curing or on-site brick laying.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            🛡️
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">High Durability & Strength</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Manufactured with M-30 to M-40 grade RCC. Designed to withstand harsh weather, seismic vibrations, and extreme temperatures.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl mb-4">
                            💰
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Cost Effective & Relocatable</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Minimizes labor overhead and material wastage. Can be safely dismantled and relocated if boundary layouts change in the future.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Specs & Manufacturing Process */}
            <section className="bg-slate-100 py-16 px-4 border-y border-slate-200">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
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

                    {/* How Precast Walls Are Made */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">How Precast Walls Are Made</h2>
                        <div className="space-y-4">
                            {manufacturingSteps.map((step) => (
                                <div key={step.step} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
                                    <div className="flex gap-4 items-start flex-1">
                                        <span className="text-yellow-700 font-extrabold text-lg bg-yellow-50 px-3 py-1 rounded-lg">
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

                </div>
            </section>

            {/* 4. Installation Workflow */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">4-Step On-Site Installation Process</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {installationSteps.map((item) => (
                        <div key={item.num} className="bg-white p-6 rounded-2xl border border-slate-200 relative text-center shadow-sm">
                            <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                                {item.num}
                            </div>
                            <h3 className="font-semibold text-slate-800 text-sm">{item.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Contact & Estimate Form */}
            <section id="enquiry-form" className="py-16 px-4 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Request an Instant Quote</h2>
                        <p className="text-slate-400 text-sm">
                            Send us your site details and boundary dimensions for a customized cost estimate.
                        </p>
                    </div>

                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-yellow-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+91 9876543210"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-yellow-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Site Location / City</label>
                            <input
                                type="text"
                                placeholder="e.g., Alwar, Bhiwadi, Gurugram"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-yellow-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Estimated Boundary Length (Running Feet)</label>
                            <input
                                type="number"
                                placeholder="e.g., 200 ft"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-yellow-500 text-sm"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Notes / Requirements</label>
                            <textarea
                                rows="3"
                                placeholder="Specify wall height required (e.g., 6ft, 8ft) or additional features..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-yellow-500 text-sm"
                            ></textarea>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="button"
                                className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base"
                            >
                                Send Enquiry
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}