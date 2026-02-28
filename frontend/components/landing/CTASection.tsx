"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="relative bg-[#0A0F1E] py-24 sm:py-32 overflow-hidden">
            {/* Gradient glow background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-teal-500/20 blur-[100px]" />
                {/* Dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    {/* Tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8">
                        Ready to start?
                    </div>

                    {/* Heading */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Your Revenue Data{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                            Is Waiting
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop guessing. Start seeing exactly where your revenue comes from —
                        which channels perform, which room types convert, and which periods
                        matter most.
                    </p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white border-0 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 text-base px-10 h-14 gap-2.5 font-semibold"
                            >
                                Open the Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust note */}
                    <p className="mt-6 text-xs text-slate-600">
                        No account required • Built for hospitality professionals
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
