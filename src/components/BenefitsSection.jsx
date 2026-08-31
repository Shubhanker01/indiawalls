const benefits = [
    {
        icon: '⚡',
        title: 'Quick Installation',
        description: 'Precast components arrive ready to assemble, reducing on-site construction time by up to 50% compared to traditional brickwork.',
    },
    {
        icon: '🌧️',
        title: 'Weather & Element Resistant',
        description: 'Engineered high-density RCC withstands intense monsoon rains, severe summer heat, and soil erosion without structural degradation.',
    },
    {
        icon: '🔧',
        title: 'Low Maintenance',
        description: 'Requires zero regular plastering or painting, providing a hassle-free and cost-saving boundary solution over decades.',
    },
    {
        icon: '🛡️',
        title: 'Enhanced Site Security',
        description: 'High-tensile steel reinforcement creates an impenetrable physical barrier against unauthorized intrusion and stray animals.',
    },
    {
        icon: '💰',
        title: 'Cost-Effective Solution',
        description: 'Lowers total project expenditure by minimizing expensive manual labor, raw material waste, and prolonged site setup fees.',
    },
    {
        icon: '🌱',
        title: 'Eco-Friendly & Sustainable',
        description: 'Factory-controlled casting drastically reduces water waste, dust pollution, and raw material degradation at your project location.',
    },
    {
        icon: '📈',
        title: 'Increases Property Value',
        description: 'Defines clean, permanent boundary lines that instantly boost the market evaluation and security profile of your land plot.',
    },
    {
        icon: '🏋️',
        title: 'High Structural Durability',
        description: 'Pre-stressed steel strands embedded in high-grade concrete ensure maximum load resistance and long-term stability.',
    },
    {
        icon: '🔄',
        title: 'Relocatable & Modular',
        description: 'Can be safely dismantled, transported, and re-erected if land boundaries or project layouts change in the future.',
    },
];

export default function BenefitsSection() {
    return (
        <section className="py-20 bg-white border-y border-slate-200" id="benefits">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                        Structural Advantages
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                        Benefits of Reinforced Concrete Walls
                    </h2>
                    <p className="text-slate-700 text-sm sm:text-base">
                        Why leading site developers and landowners across NCR choose precast RCC walls over traditional brick boundaries.
                    </p>
                </div>

                {/* BENEFITS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((item, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500/50 hover:bg-slate-100/80 transition-all duration-200 space-y-3 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}