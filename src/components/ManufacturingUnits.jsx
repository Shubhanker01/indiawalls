import { Clock } from 'lucide-react';
import UnitsExplorer from './UnitsExplorer';
import AnimatedSection from './AnimatedSection';

const units = [
    { city: 'Kotkasim Unit', region: 'Rajasthan', address: 'Kotkasim industrial area', lat: 27.70, lng: 76.63 },
    { city: 'Tapukara Unit', region: 'Rajasthan', address: 'Tapukara industrial area', lat: 28.08, lng: 76.86 },
    { city: 'Alwar Unit', region: 'Rajasthan', address: 'Alwar industrial area', lat: 27.553, lng: 76.634 },
    { city: 'Ringus Unit', region: 'Rajasthan', address: 'Ringus industrial area', lat: 27.37, lng: 75.57 },
    { city: 'Ramgarh Unit', region: 'Rajasthan', address: 'Ramgarh industrial area', lat: 27.57, lng: 76.87 },
    { city: 'Govindgarh Unit', region: 'Rajasthan', address: 'Govindgarh industrial area', lat: 27.22, lng: 75.83 },
    { city: 'Mundawar Unit', region: 'Rajasthan', address: 'Mundawar industrial area', lat: 27.97, lng: 76.45 },
    { city: 'Faridabad Unit', region: 'Haryana / NCR Zone', address: 'Faridabad industrial area', lat: 28.409, lng: 77.318 },
    { city: 'Bahadurgarh Unit', region: 'Haryana / NCR Zone', address: 'Bahadurgarh industrial area', lat: 28.693, lng: 76.935 },
    { city: 'Palwal Unit', region: 'Haryana / NCR Zone', address: 'Palwal industrial area', lat: 28.149, lng: 77.332 },
];

const PHONE = '+919950711475';

export default function ManufacturingUnits() {
    return (
        <section className="border-y border-slate-200 bg-slate-50 py-20" id="locations">
            <div className="mx-auto max-w-7xl px-4 sm:px-8">
                <AnimatedSection delay={0.05} className="mx-auto mb-12 max-w-2xl text-center">
                    <h2 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
                        Our Manufacturing Sites
                    </h2>
                    <div className="mx-auto mt-5 h-1.5 w-16 rounded-full bg-yellow-400" aria-hidden="true" />
                    <p className="mt-6 text-base leading-relaxed text-slate-600 text-balance sm:text-lg">
                        Our manufacturing units are strategically located across key industrial zones to ensure rapid delivery.
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-yellow-400">
                        <Clock size={16} aria-hidden="true" />
                        Site visit available within two hours
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pt-6">
                        <a
                            href={`tel:${PHONE}`}
                            className="inline-flex items-center justify-center rounded-lg bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        >
                            Call Now
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        >
                            Enquire Now
                        </a>
                    </div>
                </AnimatedSection>

                <UnitsExplorer units={units} phone={PHONE} />
            </div>
        </section>
    );
}
