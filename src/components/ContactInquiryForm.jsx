'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { apiPost } from '@/lib/api/client';

export default function ContactInquiryForm() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        productCategory: 'Precast Concrete Boundary Wall',
        lengthFeet: '',
        heightFeet: '6',
        location: '',
        message: '',
    });

    const [status, setStatus] = useState({ loading: false, error: '', success: false, message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false, message: '' });

        try {
            const data = await apiPost('/api/inquiries', formData);
            setStatus({
                loading: false,
                error: '',
                success: true,
                message: data.message || 'Inquiry submitted successfully! We will contact you soon.',
            });
            setFormData({
                name: '',
                phone: '',
                email: '',
                productCategory: 'Precast Concrete Boundary Wall',
                lengthFeet: '',
                heightFeet: '6',
                location: '',
                message: '',
            });
        } catch (err) {
            setStatus({
                loading: false,
                error: err.data?.error || 'Unable to submit inquiry. Please call +91 9950711475 directly.',
                success: false,
                message: '',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {status.success && (
                <div className="sm:col-span-2 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 font-medium text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{status.message}</span>
                </div>
            )}

            {status.error && (
                <div className="sm:col-span-2 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 font-medium text-sm">
                    {status.error}
                </div>
            )}

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Your Full Name *
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Phone / Mobile Number *
                </label>
                <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                </label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Product Category
                </label>
                <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                >
                    <option value="Precast Concrete Boundary Wall">Precast Concrete Boundary Wall</option>
                    <option value="RCC Fencing Poles">RCC Fencing Poles</option>
                    <option value="Chainlink Mesh Fencing">Chainlink Mesh Fencing</option>
                    <option value="Interlocking Paver Blocks">Interlocking Paver Blocks</option>
                    <option value="Multiple / Turnkey Project">Multiple / Turnkey Project</option>
                </select>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Approx. Length (Running Feet)
                </label>
                <input
                    type="number"
                    name="lengthFeet"
                    min="0"
                    value={formData.lengthFeet}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Wall Height
                </label>
                <select
                    name="heightFeet"
                    value={formData.heightFeet}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                >
                    {[5, 6, 7, 8, 9, 10].map((h) => (
                        <option key={h} value={h}>
                            {h} Feet
                        </option>
                    ))}
                </select>
            </div>

            <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Site Location / City *
                </label>
                <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Neemrana Industrial Area, Alwar, or Gurugram"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Specific Requirements or Timeline
                </label>
                <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share any details about ground topography, installation dates, or gate requirements..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:border-yellow-500 transition"
                ></textarea>
            </div>

            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={status.loading}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-4 rounded-xl shadow-lg transition duration-200 text-base flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                    {status.loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting Quote Request...
                        </>
                    ) : (
                        'Submit Inquiry for Free Estimate'
                    )}
                </button>
            </div>
        </form>
    );
}
