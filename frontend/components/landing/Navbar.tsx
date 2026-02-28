"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BarChart3, ArrowRight, X } from "lucide-react";

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Metrics", href: "#metrics" },
    { label: "How It Works", href: "#how-it-works" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSmoothScroll = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string,
    ) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: "smooth" });
            setOpen(false);
        }
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "backdrop-blur-md bg-[#0A0F1E]/80 border-b border-white/10 shadow-lg shadow-black/20"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white text-sm tracking-tight">
                            HotelRevenue
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleSmoothScroll(e, link.href)}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-md hover:bg-white/5"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/dashboard">
                            <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white border-0 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 gap-1.5"
                            >
                                Open Dashboard
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-72 bg-[#0D1526] border-white/10 p-0"
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                                            <BarChart3 className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="font-semibold text-white text-sm">
                                            HotelRevenue
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setOpen(false)}
                                        className="text-slate-400 hover:text-white hover:bg-white/10 w-7 h-7"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                                <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
                                    {navLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            onClick={(e) => handleSmoothScroll(e, link.href)}
                                            className="px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                </nav>
                                <div className="px-4 pb-8">
                                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                                        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white border-0 gap-2">
                                            Open Dashboard
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
}
