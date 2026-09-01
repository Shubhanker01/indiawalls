import Image from 'next/image';
import Link from 'next/link';
export default function ProductCatalog() {
    return (
        <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto" id="products">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Our Core Product Line</h2>
                <p className="text-slate-600">Engineered precast concrete solutions tailored for agricultural, commercial, and residential boundaries.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Card 1 */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition group">
                    <div className="h-56 bg-slate-200 relative">
                        {/* Replace with Next Image */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src='/PreCastWallImage.webp' alt="Precase Wall Image" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Most Popular</span>
                        <h3 className="text-md font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Precast RCC Boundary Walls</h3>
                        <p className="text-slate-800 text-sm mb-4">Strong interlocked precast panels supported by pre-stressed concrete posts. Weather-proof and relocatable.</p>
                        <Link href="/products/precast-walls" className="text-amber-600 font-semibold text-sm hover:underline">
                            View Specs & Designs →
                        </Link>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition group">
                    <div className="h-56 bg-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src='/DesignerStoneWalls.webp' alt="Designer Stone Walls" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Aesthetic Finish</span>
                        <h3 className="text-md font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Designer Stone Texture Walls</h3>
                        <p className="text-slate-800 text-sm mb-4">Precast concrete molded with natural stone patterns. Ideal for farmhouses, villas, and premium commercial plots.</p>
                        <Link href="/products/designer-walls" className="text-amber-600 font-semibold text-sm hover:underline">
                            Explore Patterns →
                        </Link>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition group">
                    <div className="h-56 bg-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-400 font-semibold">
                            <Image src='/PaverBlocks.webp' alt="Paver Blocks" fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"></Image>
                        </div>
                    </div>
                    <div className="p-6">
                        <span className="text-md font-bold text-amber-700 uppercase tracking-wider">Heavy Duty</span>
                        <h3 className="text-md font-bold mt-1 mb-2 group-hover:text-amber-600 transition">Interlocking Paver Blocks</h3>
                        <p className="text-slate-800 text-sm mb-4">High-density interlocking concrete blocks built for industrial driveways, parking lots, and walkways.</p>
                        <Link href="/products/paver-blocks" className="text-amber-600 font-semibold text-sm hover:underline">
                            View Thickness & Shapes →
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}