"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, SlidersHorizontal, Sparkles } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Upload,
        title: "Connect Your Data",
        description:
            "Upload your hotel booking dataset or connect to your existing PMS. Supports CSV, Excel, and standard hospitality data formats.",
        gradient: "from-blue-500 to-blue-600",
        glow: "shadow-blue-500/30",
    },
    {
        number: "02",
        icon: SlidersHorizontal,
        title: "Apply Your Filters",
        description:
            "Select date range, property, room category, booking channel, and guest origin. Combine multiple filters for precise segmentation.",
        gradient: "from-cyan-500 to-teal-500",
        glow: "shadow-cyan-500/30",
    },
    {
        number: "03",
        icon: Sparkles,
        title: "Gain Instant Clarity",
        description:
            "All charts and KPIs update in real-time as you filter. React Query caching ensures sub-second response — no waiting, just insights.",
        gradient: "from-amber-500 to-orange-500",
        glow: "shadow-amber-500/30",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative bg-[#0A0F1E] py-24 sm:py-32 overflow-hidden"
        >
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/20 bg-teal-500/8 text-teal-400 text-xs font-medium mb-4">
                        Getting Started
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Up and Running in Seconds
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        No complex setup. No integration headaches. Just your data and
                        instant revenue clarity.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting dashed line (desktop only) */}
                    <div className="hidden lg:block absolute top-[52px] left-[calc(16.666%+48px)] right-[calc(16.666%+48px)] h-px">
                        <div className="w-full border-t border-dashed border-white/15" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15 }}
                                className="flex flex-col items-center text-center lg:text-left lg:items-start"
                            >
                                {/* Icon + number badge */}
                                <div className="relative mb-6">
                                    <div
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl ${step.glow}`}
                                    >
                                        <step.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0D1526] border border-white/15 text-xs font-bold text-slate-300 flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="text-xs font-mono text-slate-500 mb-2">
                                    Step {step.number}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed max-w-xs lg:max-w-none">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
