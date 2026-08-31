'use client';

const projects = [
    {
        title: 'Industrial Area, Chopanki, Bhiwadi',
        image: '/IndustrialAreaBhiwadi.webp',
    },
    {
        title: 'Paver Block Installation, M.I.A Alwar',
        image: '/MIAAlwar.webp',
    },
    {
        title: 'Precast Boundary Wall, Sector 74, Gurugram',
        image: '/Gurugram.webp',
    },
    {
        title: 'Compound Wall Project, Dayalpur, Faridabad',
        image: '/Dayalpur.webp',
    },
    {
        title: 'Mahwa, Near Sikandra, Rajasthan',
        image: '/Mahwa.webp',
    },
    {
        title: 'Alwar, Rajasthan',
        image: '/Alwar.webp',
    }
];

export default function OurWorkMinimal() {
    return (
        <section className="py-20 bg-slate-900 text-white" id="our-work">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION TITLE */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                        Our Work
                    </h2>
                </div>

                {/* IMAGE CAROUSEL / GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden group shadow-lg"
                        >
                            <div className="relative h-64 overflow-hidden bg-slate-950">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-full w-full
                                    group-hover:scale-105 transition-transform duration-300"
                                    height={100}
                                    width={100}
                                />
                            </div>
                            <div className="p-4 bg-slate-800 text-center">
                                <p className="text-sm font-semibold text-slate-200">
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}