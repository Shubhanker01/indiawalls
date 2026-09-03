"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
const products = [
    {
        id: 1,
        title: 'Precast Walls',
        slug: 'precast-walls',
        image: 'images/products/precast walls.webp',
        description:
            'Precast walls are durable concrete panels manufactured off-site and assembled quickly, reducing construction time and ensuring consistent quality. They offer design flexibility and improve site safety by minimizing on-site labor.',
        badge: 'Boundary Solutions',
    },
    {
        id: 2,
        title: 'Paver Blocks',
        slug: 'paver-blocks',
        image: '/images/products/paver blocks.webp',
        description:
            'Paver blocks are sturdy, interlocking concrete units ideal for driveways, walkways, and patios. They provide easy installation, require minimal maintenance, and come in various shapes and colors, allowing for customized, visually appealing designs in outdoor spaces.',
        badge: 'Paving Solutions',
    },
    {
        id: 3,
        title: 'Fencing Pole',
        slug: 'fencing-pole',
        image: '/images/products/Fencing pole.webp',
        description:
            'Fencing poles are sturdy vertical supports used to hold fencing materials in place, providing security and boundary definition for properties. Typically made from metal, wood, or concrete, they are durable, easy to install, and can accommodate various fencing styles.',
        badge: 'Structural Support',
    },
    {
        id: 4,
        title: 'Chainlink/Concertina Wire',
        slug: 'chainlink-concertina-wire',
        image: '/images/products/chainlink.webp', // Replace with your local asset path
        description:
            'Chainlink and concertina wire are popular fencing materials used for security purposes. Chainlink is a woven metal mesh that provides a strong, flexible barrier, commonly used for residential, industrial, and sports facility fencing. Concertina wire, often used in high-security areas, consists of coiled razor or barbed wire that creates a formidable obstacle, deterring unauthorized access. Both materials are durable, cost-effective, and easy to install.',
        badge: 'Perimeter Security',
    },
];

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <Navbar />
            {/* Top Banner */}
            <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-800">
                <div className="max-w-4xl mx-auto">
                    <span className="text-emerald-400 font-semibold text-xs tracking-widest uppercase">
                        Indiawalls Portfolio
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 tracking-tight">
                        Our Products
                    </h1>
                    <p className="mt-3 text-slate-400 text-base max-w-xl mx-auto">
                        High-durability precast RCC panels, interlocking pavers, and perimeter security fencing manufactured in Alwar, Rajasthan.
                    </p>
                </div>
            </section>

            {/* Main Content & Product Cards */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {products.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Product Image linked to single product route */}
                            <Link
                                href={`/products/${item.slug}`}
                                className="block relative h-56 bg-slate-100 overflow-hidden group"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
                                    {item.badge}
                                </span>
                            </Link>

                            <div className="p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    {/* Linked Heading */}
                                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="hover:text-emerald-600 transition-colors duration-200 flex items-center justify-between group"
                                        >
                                            <span>{item.title}</span>
                                            <span className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200 text-lg">
                                                →
                                            </span>
                                        </Link>
                                    </h2>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => alert(`Enquiry initiated for: ${item.title}`)}
                                        className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <span>Send Enquiry</span>
                                        <span className="text-xs">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer Details */}
            <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                    <div>
                        <p className="font-semibold text-slate-300">Indiawalls Manufacturing Unit</p>
                        <p className="mt-1">
                            Khasra No. 251, 252, Tehsil Tapukara, Daganheri Alwar, Rajasthan- 301707.
                        </p>
                    </div>
                    <p className="text-slate-500">
                        Copyright © 2026 Indiawalls. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}