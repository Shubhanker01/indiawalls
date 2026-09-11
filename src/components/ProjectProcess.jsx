import AnimatedSection from './AnimatedSection';

const processSteps = [
    {
        step: '01',
        title: 'Consultation & Site Assessment',
        description:
            'We start with a detailed consultation to understand your land boundary requirements and assess the site for a customized structural solution.',
        icon: '📋',
    },
    {
        step: '02',
        title: 'Design & Engineering Planning',
        description:
            'Our team plans and designs your boundary wall layout using advanced engineering parameters to ensure precise alignment with your land specifications.',
        icon: '📐',
    },
    {
        step: '03',
        title: 'Precision Factory Production',
        description:
            'We manufacture the reinforced precast concrete panels and prestressed columns in our high-capacity facilities under strict quality controls.',
        icon: '🏗️',
    },
    {
        step: '04',
        title: 'Fast On-Site Installation',
        description:
            'Our expert installation team transports the precast components and assembles the compound wall on-site using specialized interlocking techniques.',
        icon: '🛠️',
    },
    {
        step: '05',
        title: 'Final Quality Inspection',
        description:
            'We conduct a thorough final inspection to verify structural soundness, panel alignment, and total security standards before handover.',
        icon: '✅',
    },
];

export default function ProjectProcess() {
    return (
        <section className="py-20 bg-slate-50 border-y border-slate-200" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200 px-3.5 py-1.5 rounded-full border border-amber-200">
                        Our Process
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-4">
                        How We Complete a Full Project
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        From initial site measurement to final inspection, our streamlined 5-step workflow ensures fast and reliable execution.
                    </p>
                </AnimatedSection>

                {/* PROCESS GRID */}
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
                    {processSteps.map((item, index) => (
                        <AnimatedSection
                            key={index}
                            delay={0.15 + index * 0.08}
                            className="bg-white border border-slate-400 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition group"
                        >
                            <div>
                                {/* Step Badge & Icon */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center font-bold text-lg">
                                        {item.icon}
                                    </span>
                                    <span className="text-3xl font-black text-slate-500 group-hover:text-amber-500 transition">
                                        {item.step}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-700 text-xs leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Progress Bar Indicator at Card Bottom */}
                            <div className="w-full bg-slate-100 h-1 rounded-full mt-6 overflow-hidden">
                                <div className="bg-amber-500 h-full w-0 group-hover:w-full transition-all duration-300"></div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}