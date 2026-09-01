export default function Header() {
    return (
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
    )
}