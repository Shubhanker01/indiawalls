import Link from "next/link";
import Image from "next/image";
import AboutSection from "../components/AboutSection"
import WhyUsSection from "@/components/WhyUsSection";
import ProjectProcess from "@/components/ProjectProcess";
import BenefitsSection from "@/components/BenefitsSection";
import OurWorkMinimal from "@/components/OurWork";
import ManufacturingUnits from "@/components/ManufacturingUnits";
import TestimonialsSection from "@/components/TestimonialsSection";
import ClienteleSection from "@/components/ClientelSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* 1. TOP HEADER / CONTACT BAR */}
      <div className="bg-slate-900 text-slate-300 text-sm py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs sm:text-sm">
            📍 Manufacturing Plants: <span className="text-amber-500 font-medium">Alwar • Bhiwadi • Gurugram • Panipat</span>
          </p>
          <div className="flex items-center space-x-6 text-xs sm:text-sm">
            <a href="tel:+917820879777" className="hover:text-white transition text-slate-100">📞 +91 78208 79777</a>
            <a href="https://wa.me/919653545525" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">💬 WhatsApp Us</a>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="space-x-2">
            {/* <span className="text-2xl font-black tracking-tight text-slate-900">
              INDIA<span className="text-amber-600">WALLS</span>
            </span> */}
            <Image
              src="/Logo-Indiawalls.svg"
              alt="Indiawalls Infratech Logo"
              priority
              width={128}
              height={128}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8 font-medium text-slate-800">
            <Link href="/" className="text-amber-800">Home</Link>
            <Link href="#products" className="hover:text-amber-800 transition">Products</Link>
            <Link href="#why-us" className="hover:text-amber-800 transition">Why Us</Link>
            <Link href="#gallery" className="hover:text-amber-800 transition">Projects</Link>
            <Link href="#contact" className="hover:text-amber-800 transition">Contact</Link>
          </div>

          <a
            href="#quote"
            className="bg-amber-700 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-lg transition shadow-md hover:shadow-lg"
          >
            Get Custom Quote
          </a>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-8 overflow-hidden">
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

              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition shadow-md">
                Get Estimated Pricing →
              </button>
            </form>
          </div>

        </div>
      </section>
      <AboutSection />
      <WhyUsSection />
      <ProjectProcess />
      {/* 4. PRODUCT CATALOG */}
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
                <Image src='/PreCastWallImage.webp' alt="Precase Wall Image" fill width={100} height={100}></Image>
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
                <Image src='/DesignerStoneWalls.webp' alt="Designer Stone Walls" fill></Image>
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
                <Image src='/PaverBlocks.webp' alt="Paver Blocks" fill></Image>
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

      <BenefitsSection />
      <OurWorkMinimal />
      <ManufacturingUnits />
      <TestimonialsSection />
      <ClienteleSection />
      <FaqSection />
      {/* 5. FOOTER */}
      <Footer />

    </div>
  );

}
