import AnimatedSection from './AnimatedSection';

const units = [
    {
        city: 'Kotkasim Unit',
        region: 'Rajasthan',
        address: 'Kotkasim industrial area, Rajasthan',
        geo: 'Kotkasim, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Kotkasim,Rajasthan',
    },
    {
        city: 'Tapukala Unit',
        region: 'Rajasthan',
        address: 'Tapukala industrial area, Rajasthan',
        geo: 'Tapukala, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Tapukala,Rajasthan',
    },
    {
        city: 'Alwar Unit',
        region: 'Rajasthan',
        address: 'Alwar industrial area, Rajasthan',
        geo: 'Alwar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Alwar,Rajasthan',
    },
    {
        city: 'Ringur Unit',
        region: 'Rajasthan',
        address: 'Ringur industrial area, Rajasthan',
        geo: 'Ringur, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ringur,Rajasthan',
    },
    {
        city: 'Ramghar Unit',
        region: 'Rajasthan',
        address: 'Ramghar industrial area, Rajasthan',
        geo: 'Ramghar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ramghar,Rajasthan',
    },
    {
        city: 'Faridabad Unit',
        region: 'Haryana / NCR Zone',
        address: 'Faridabad industrial area, Haryana',
        geo: 'Faridabad, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Faridabad,Haryana',
    },
    {
        city: 'Bahadurgarh Unit',
        region: 'Haryana / NCR Zone',
        address: 'Bahadurgarh industrial area, Haryana',
        geo: 'Bahadurgarh, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Bahadurgarh,Haryana',
    },
    {
        city: 'Palwal Unit',
        region: 'Haryana / NCR Zone',
        address: 'Palwal industrial area, Haryana',
        geo: 'Palwal, Haryana',
        mapsUrl: 'https://maps.google.com/?q=Palwal,Haryana',
    },
    {
        city: 'Govindgarh Unit',
        region: 'Rajasthan',
        address: 'Govindgarh industrial area, Rajasthan',
        geo: 'Govindgarh, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Govindgarh,Rajasthan',
    },
    {
        city: 'Mundawar Unit',
        region: 'Rajasthan',
        address: 'Mundawar industrial area, Rajasthan',
        geo: 'Mundawar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Mundawar,Rajasthan',
    },
];

export default function ManufacturingUnits() {
    return (
        <section className="precast-slate-pattern py-20 text-white border-y border-slate-800" id="locations">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-4">
                        Factory Network
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 leading-tight">
                        Our Manufacturing Units
                    </h2>
                    <p className="text-lg sm:text-xl text-[#d7dce1] leading-8">
                        Our manufacturing units are strategically located across the following cities to ensure prompt precast production and rapid delivery:
                    </p>
                    <p className="text-amber-300 text-sm sm:text-base font-medium">
                        Site visit within two hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <a
                            href="tel:+919950711475"
                            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400"
                        >
                            Call Now
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-100 transition hover:border-amber-400 hover:text-amber-300"
                        >
                            Enquire Now
                        </a>
                    </div>
                </AnimatedSection>

                {/* LOCATIONS GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {units.map((unit, idx) => (
                        <AnimatedSection
                            key={idx}
                            delay={0.15 + idx * 0.08}
                            className="bg-[rgba(20,24,29,0.45)] border border-slate-700/80 rounded-2xl p-7 flex flex-col justify-between hover:border-amber-500/50 transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
                                        📍
                                    </span>
                                    <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                                        {unit.region}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-white mb-3">
                                        {unit.city}
                                    </h3>
                                    <p className="text-base sm:text-lg text-[#d7dce1] leading-7">
                                        {unit.address}
                                    </p>
                                </div>
                            </div>

                            {/* GEO-LOCATION & MAP BUTTON */}
                            <div className="pt-6 mt-6 border-t border-slate-700/60 space-y-3">
                                <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                                    <span className="text-amber-500">🌐</span>
                                    <span>{unit.geo}</span>
                                </div>

                                <a
                                    href={unit.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center space-x-2 bg-slate-700 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-xs font-bold py-2.5 px-4 rounded-xl transition duration-200"
                                >
                                    <span>Open in Google Maps</span>
                                    <span>↗</span>
                                </a>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

            </div>
        </section>
    );
}