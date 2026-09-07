export default function HeroSection() {
    return (
        <section className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">

                <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3.5 py-1.5 rounded-full text-sm font-medium">
                        ⚡ Over 2,000+ Projects Completed Across NCR & Rajasthan
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                        High-Strength <span className="text-amber-500">Precast Boundary Walls</span> for Land & Industrial Security
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                        Fast, durable, and cost-effective readymade RCC boundary walls and paver blocks. Manufactured in state-of-the-art facilities and installed within days.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <a
                            href="#quote"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-center font-bold px-7 py-4 rounded-xl shadow-lg transition"
                        >
                            Request Site Estimate
                        </a>
                        <a
                            href="tel:+917820879777"
                            className="border border-slate-600 hover:border-slate-400 text-white text-center font-semibold px-7 py-4 rounded-xl transition"
                        >
                            Call Engineer: 7820879777
                        </a>
                    </div>

                    {/* Micro Stats */}
                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
                        <div>
                            <p className="text-2xl font-black text-amber-400">10+ Yrs</p>
                            <p className="text-xs text-slate-400">Industry Experience</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-amber-400">50%</p>
                            <p className="text-xs text-slate-400">Faster Than Brickwork</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-amber-400">Low</p>
                            <p className="text-xs text-slate-400">Maintenance Cost</p>
                        </div>
                    </div>
                </div>

                {/* Quick Lead Form Card */}
                <div className="lg:col-span-5 bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100" id="quote">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Get an Instant Price Quote</h3>
                    <p className="text-sm text-slate-600 mb-6">Fill out your land requirements and we will contact you in 2 hours.</p>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Name</label>
                            <input type="text" placeholder="e.g. Rohit Kumar" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Phone Number</label>
                            <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <div>
                            <label htmlFor="city-select" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Project Location</label>
                            <select id="city-select" name="city" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none">
                                <option value="">Select City</option>
                                <option value="Bhiwadi">Bhiwadi / Chopanki</option>
                                <option value="Alwar">Alwar / MIA</option>
                                <option value="Gurugram">Gurugram / NCR</option>
                                <option value="Faridabad">Faridabad / Palwal</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Approx. Wall Length (Running Feet)</label>
                            <input type="number" placeholder="e.g. 500 ft" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <div>
                            <label htmlFor="height" className="block text-xs font-semibold text-slate-700 uppercase mb-1">Height</label>
                            <input id="height" name="height" type="number" placeholder="e.g. 6 ft" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none" />
                        </div>

                        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-md">
                            Get Estimated Pricing →
                        </button>
                    </form>
                </div>

            </div>
        </section>
    )
}