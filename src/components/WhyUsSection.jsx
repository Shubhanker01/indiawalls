import AnimatedCounter from './AnimatedCounter';

const stats = [
    { label: 'Satisfied Clients', value: 2000, suffix: '+' },
    { label: 'Years Experience', value: 10, suffix: '+' },
    { label: 'Manufacturing Units', value: 7, suffix: '' },
    { label: 'Skilled Laborers', value: 150, suffix: '+' },
];

const features = [
    {
        icon: '⚡',
        title: '50% Faster Installation',
        description: 'Pre-cast off-site under strict factory monitoring and assembled on-site in just a few days.',
    },
    {
        icon: '🛡️',
        title: 'High Durability RCC',
        description: 'Reinforced concrete design built to withstand extreme monsoon conditions and hot weather.',
    },
    {
        icon: '💰',
        title: 'Cost Effective',
        description: 'Saves up to 40% overall compared to traditional brickwork and continuous labor management.',
    },
    {
        icon: '🔄',
        title: 'Relocatable Design',
        description: 'Easily uninstalled and moved to a new site if land usage requirements change.',
    },
];

export default function WhyUsSection() {
    return (
        <section className="py-20 bg-slate-900 text-white border-y border-slate-800" id="why-us">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
                        Why Choose Indiawalls
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-6">
                        Engineered for Strength. Delivered with Speed.
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Over a decade of manufacturing excellence across Rajasthan and Delhi NCR.
                    </p>
                </div>

                {/* ANIMATED STATS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center hover:border-amber-500/40 transition"
                        >
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 mb-1">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-xs sm:text-sm font-medium text-slate-300">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* FEATURES GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-3 hover:bg-slate-800/80 transition"
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}