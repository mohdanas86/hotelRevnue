"use client";

import React from "react";
import Link from "next/link";
import { BarChart3, Github } from "lucide-react";

const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "#features" },
    { label: "Metrics", href: "#metrics" },
    { label: "How It Works", href: "#how-it-works" },
];

export function Footer() {
    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="relative bg-[#0A0F1E] border-t border-white/8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="font-semibold text-white text-sm leading-tight">
                                HotelRevenue
                            </div>
                            <div className="text-xs text-slate-500">Analytics Dashboard</div>
                        </div>
                    </div>

                    {/* Nav links */}
                    <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={
                                    link.href.startsWith("#")
                                        ? (e) => handleSmoothScroll(e, link.href)
                                        : undefined
                                }
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-600">
                        © {new Date().getFullYear()} HotelRevenue. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-600">
                        Built for hospitality revenue professionals
                    </p>
                </div>
            </div>
        </footer>
    );
}
