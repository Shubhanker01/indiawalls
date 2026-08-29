const testimonials = [
    {
        name: 'Rajesh Sharma',
        role: 'Site Manager, Industrial Park',
        location: 'Bhiwadi',
        rating: 5,
        quote:
            'The precast RCC compound wall installation was fast and seamless. They completed 1,000 running feet in under 5 days, saving us significant labor costs compared to traditional brick masonry.',
    },
    {
        name: 'Vikram Singh',
        role: 'Commercial Plot Owner',
        location: 'Alwar',
        rating: 5,
        quote:
            'Outstanding quality and alignment. The precast panels and posts are very sturdy, and the team ensured precise boundary demarcation without any material wastage on site.',
    },
    {
        name: 'Amit Patel',
        role: 'Civil Infrastructure Contractor',
        location: 'Gurugram',
        rating: 5,
        quote:
            'We sourced both boundary walls and heavy-duty paver blocks for our logistics yard. Prompt delivery from their factory unit and excellent structural finishing.',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-slate-50 border-y border-slate-200" id="testimonials">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">

                {/* SECTION HEADER */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                        Client Feedback
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                        What Our Customers Say
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Feedback from site developers, landowners, and contractors who trust our precast concrete boundary solutions.
                    </p>
                </div>

                {/* TESTIMONIALS GRID */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200"
                        >
                            <div className="space-y-4">
                                {/* Rating Stars */}
                                <div className="flex space-x-1 text-amber-500 text-sm">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 text-sm leading-relaxed italic">
                                    "{item.quote}"
                                </p>
                            </div>

                            {/* Author Details */}
                            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {item.role}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                                    {item.location}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}