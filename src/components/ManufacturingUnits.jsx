const units = [
    {
        city: 'Bhiwadi Unit',
        region: 'Rajasthan / Delhi NCR',
        address: 'RIICO Industrial Area, Chopanki & Pathredi, Bhiwadi',
        geo: '28.2100° N, 76.8600° E',
        mapsUrl: 'https://maps.google.com/?q=28.2100,76.8600',
    },
    {
        city: 'Alwar Unit',
        region: 'Matsya Industrial Area (M.I.A)',
        address: 'RIICO Industrial Area, M.I.A., Alwar',
        geo: '27.5530° N, 76.6346° E',
        mapsUrl: 'https://maps.google.com/?q=27.5530,76.6346',
    },
    {
        city: 'Faridabad Unit',
        region: 'Haryana / NCR Zone',
        address: 'Dayalpur & Ballabhgarh Industrial Belt, Faridabad',
        geo: '28.3400° N, 77.3200° E',
        mapsUrl: 'https://maps.google.com/?q=28.3400,77.3200',
    },
    {
        city: 'Gurugram / Sohna Unit',
        region: 'Gurugram Extension Zone',
        address: 'Sohna Industrial Corridor, Gurugram',
        geo: '28.2476° N, 77.0600° E',
        mapsUrl: 'https://maps.google.com/?q=28.2476,77.0600',
    },
];

export default function ManufacturingUnits() {
    return (
        <section className="py-20 bg-slate-900 text-white border-y border-slate-800" id="locations">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 mb-4">
                        Factory Network
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mt-4">
                        Our Manufacturing Units
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Our manufacturing units are strategically located across the following cities to ensure prompt precast production and rapid delivery:
                    </p>
                </div>

                {/* LOCATIONS GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {units.map((unit, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition duration-300"
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
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {unit.city}
                                    </h3>
                                    <p className="text-slate-400 text-xs leading-relaxed">
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
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}