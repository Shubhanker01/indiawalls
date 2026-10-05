function UnitsDeck({ units }) {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {units.map((unit) => (
                <article
                    key={unit.city}
                    className="flex min-h-64 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 p-7 transition-transform duration-200 hover:-translate-y-2"
                >
                    <div className="space-y-5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-xl text-amber-600">
                                📍
                            </span>
                            <span className="rounded-full border border-amber-200 bg-amber-100/80 px-3 py-1 text-xs font-mono font-medium text-amber-700">
                                {unit.region}
                            </span>
                        </div>

                        <div>
                            <h3 className="mb-2 text-2xl font-black text-slate-900 sm:text-3xl">
                                {unit.city}
                            </h3>
                            <p className="text-base leading-relaxed text-slate-600">
                                {unit.address}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
                        <div className="flex items-center gap-2 text-sm font-mono text-slate-500">
                            <span className="text-amber-500">🌐</span>
                            <span>{unit.geo}</span>
                        </div>
                        <a
                            href={unit.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition duration-200 hover:bg-amber-500 hover:text-slate-950"
                        >
                            <span>Open in Google Maps</span>
                            <span>↗</span>
                        </a>
                    </div>
                </article>
            ))}
        </div>
    );
}

export default UnitsDeck;
