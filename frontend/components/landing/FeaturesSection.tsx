"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
    TrendingUp,
    Filter,
    Globe,
    BarChart2,
    Zap,
    Calendar,
    Download,
    Bell,
    Building2,
} from "lucide-react";

const features = [
    {
        icon: TrendingUp,
        title: "Real-Time Revenue Tracking",
        description:
            "Monitor total revenue, ADR, and RevPAR as they update. Spot trends instantly with live-synced charts.",
        gradient: "from-blue-500 to-blue-600",
        glow: "group-hover:shadow-blue-500/25",
    },
    {
        icon: Filter,
        title: "Powerful Filtering",
        description:
            "Slice and drill into data by date range, hotel property, room type, booking channel, and guest country.",
        gradient: "from-cyan-500 to-cyan-600",
        glow: "group-hover:shadow-cyan-500/25",
    },
    {
        icon: Globe,
        title: "Geographic Intelligence",
        description:
            "Discover which countries and regions drive the most bookings and revenue — visualized on interactive maps.",
        gradient: "from-teal-500 to-teal-600",
        glow: "group-hover:shadow-teal-500/25",
    },
    {
        icon: BarChart2,
        title: "Channel Performance",
        description:
            "Compare OTA, direct, corporate, and GDS booking channels side-by-side to optimize your distribution mix.",
        gradient: "from-violet-500 to-violet-600",
        glow: "group-hover:shadow-violet-500/25",
    },
    {
        icon: Zap,
        title: "Instant Insights",
        description:
            "React Query caching delivers sub-second filter response times. No waiting — just answers.",
        gradient: "from-amber-500 to-orange-500",
        glow: "group-hover:shadow-amber-500/25",
    },
    {
        icon: Calendar,
        title: "Occupancy Forecasting",
        description:
            "Track occupancy trends over time and identify seasonal patterns before they impact your bottom line.",
        gradient: "from-emerald-500 to-emerald-600",
        glow: "group-hover:shadow-emerald-500/25",
    },
    {
        icon: Download,
        title: "Export & Share",
        description:
            "Export filtered datasets to CSV in one click and share live dashboard URLs with your revenue team.",
        gradient: "from-pink-500 to-rose-500",
        glow: "group-hover:shadow-pink-500/25",
    },
    {
        icon: Bell,
        title: "Cancellation Monitoring",
        description:
            "Catch cancellation spikes before they crater revenue. Real-time alerts keep you ahead of the curve.",
        gradient: "from-red-500 to-red-600",
        glow: "group-hover:shadow-red-500/25",
    },
    {
        icon: Building2,
        title: "Multi-Property Support",
        description:
            "Switch between hotel properties without losing filter context. Manage your entire portfolio in one place.",
        gradient: "from-indigo-500 to-indigo-600",
        glow: "group-hover:shadow-indigo-500/25",
    },
];

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
    return (
        <section id="features" className="relative bg-[#0A0F1E] py-24 sm:py-32">
            {/* subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/8 text-blue-400 text-xs font-medium mb-4">
                        Capabilities
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        Everything a Revenue Manager Needs
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        From ADR trends to cancellation rates — all your KPIs in one
                        intelligent dashboard, built for the hospitality industry.
                    </p>
                </motion.div>

                {/* Feature cards grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {features.map((feature) => (
                        <motion.div key={feature.title} variants={cardVariants}>
                            <Card
                                className={`group relative bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 cursor-default overflow-hidden shadow-lg hover:shadow-xl ${feature.glow}`}
                            >
                                {/* Hover border glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent" />
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                                        >
                                            <feature.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-white mb-1.5">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
