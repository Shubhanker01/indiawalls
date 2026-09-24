import Image from 'next/image';

const clients = [
    { name: 'Tata', logo: '/images/clients/Tata.webp' },
    { name: 'Adani', logo: '/images/clients/adani.webp' },
    { name: 'One Group', logo: '/images/clients/OneGroup.webp' },
    { name: 'Nagar Nigam', logo: '/images/clients/municipal.webp' },
    { name: 'Indian Railways', logo: '/images/clients/IndianRailways.webp' },
    { name: 'Humanity Ahead', logo: '/images/clients/HumanityAhead.webp' },
    { name: 'Nagar Vikas', logo: '/images/clients/NagarVikas.webp' },
    { name: 'Essel', logo: '/images/clients/Essel.webp' },
];

// Duplicate array for seamless endless scrolling loop
const doubledClients = [...clients, ...clients];

export default function ClienteleSection() {
    return (
        <section className="py-16 border-y border-slate-200 overflow-hidden" id="clientele">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-10 text-center">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
                    Trusted Partners
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                    Our Clients
                </h2>
            </div>

            {/* MARQUEE CONTAINER */}
            <div className="relative w-full overflow-hidden flex items-center">

                {/* Left and Right Blur Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* INFINITE SCROLL TRACK */}
                <div className="flex gap-6 sm:gap-8 items-center animate-marquee whitespace-nowrap w-max">
                    {doubledClients.map((client, idx) => (
                        <div
                            key={idx}
                            className="relative flex w-36 sm:w-48 h-36 sm:h-40 shrink-0 items-center justify-center rounded-2xl bg-slate-100 p-5 sm:p-8 opacity-100 transition-all duration-300"
                        >
                            <div className="relative h-full w-full">
                                <Image
                                    src={client.logo}
                                    alt={`${client.name} Logo`}
                                    fill
                                    className="object-contain"
                                    sizes="(min-width: 640px) 160px, 112px"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}