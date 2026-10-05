import UnitsDeck from './UnitsDeck';
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
        city: 'Tapukara Unit',
        region: 'Rajasthan',
        address: 'Tapukara industrial area, Rajasthan',
        geo: 'Tapukara, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Tapukara,Rajasthan',
    },
    {
        city: 'Alwar Unit',
        region: 'Rajasthan',
        address: 'Alwar industrial area, Rajasthan',
        geo: 'Alwar, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Alwar,Rajasthan',
    },
    {
        city: 'Ringus Unit',
        region: 'Rajasthan',
        address: 'Ringus industrial area, Rajasthan',
        geo: 'Ringus, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ringus,Rajasthan',
    },
    {
        city: 'Ramgarh Unit',
        region: 'Rajasthan',
        address: 'Ramgarh industrial area, Rajasthan',
        geo: 'Ramgarh, Rajasthan',
        mapsUrl: 'https://maps.google.com/?q=Ramgarh,Rajasthan',
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
        <section className="py-20 border-y border-slate-200 overflow-hidden" id="locations">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <AnimatedSection delay={0.05} className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 inline-block">
                        Factory Network
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
                        Our Manufacturing Sites
                    </h2>
                    <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                        Our manufacturing units are strategically located across key industrial zones to ensure rapid delivery.
                    </p>
                    <p className="text-amber-700 text-sm font-semibold">
                        Site visit available within two hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                        <a
                            href="tel:+919950711475"
                            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 shadow-sm"
                        >
                            Call Now
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 shadow-sm"
                        >
                            Enquire Now
                        </a>
                    </div>
                </AnimatedSection>

                <UnitsDeck units={units} />

            </div>
        </section>
    );
}