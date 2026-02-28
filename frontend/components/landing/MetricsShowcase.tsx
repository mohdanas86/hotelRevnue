"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    LineChart,
    Line,
} from "recharts";

const revData = [
    { m: "Sep", v: 42 },
    { m: "Oct", v: 49 },
    { m: "Nov", v: 61 },
    { m: "Dec", v: 88 },
    { m: "Jan", v: 74 },
    { m: "Feb", v: 94 },
];

const adrData = [
    { m: "Sep", v: 112 },
    { m: "Oct", v: 118 },
    { m: "Nov", v: 122 },
    { m: "Dec", v: 145 },
    { m: "Jan", v: 130 },
    { m: "Feb", v: 127 },
];

const leadTimeData = [
    { days: "0-7", count: 340 },
    { days: "8-14", count: 220 },
    { days: "15-30", count: 180 },
    { days: "31-60", count: 95 },
    { days: "60+", count: 60 },
];

const channelData = [
    { name: "OTA", value: 45 },
    { name: "Direct", value: 30 },
    { name: "Corp", value: 15 },
    { name: "GDS", value: 10 },
];

const tooltipStyle = {
    contentStyle: {
        background: "#0D1526",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        fontSize: "10px",
        color: "#fff",
        padding: "4px 10px",
    },
};

const bentoVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cellVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
        opacity: 1,
        scale: 1,
    },
};

export function MetricsShowcase() {
    return (
        <section
            id="metrics"
            className="relative bg-[#0A0F1E] py-24 sm:py-32 overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/8 text-violet-400 text-xs font-medium mb-4">
                        Metric Library
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        20+ Metrics. One Dashboard.
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Every KPI a revenue manager cares about, rendered in beautiful,
                        interactive charts — filterable to any slice of your data.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={bentoVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]"
                >
                    {/* Revenue Over Time — spans 2 cols */}
                    <motion.div variants={cellVariants} className="lg:col-span-2">
                        <Card className="h-full bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden group">
                            <div className="p-4 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-white">
                                        Revenue Over Time
                                    </span>
                                    <span className="text-xs text-emerald-400 font-medium">
                                        ↑ 12.4%
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Monthly revenue (€k)
                                </p>
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revData}>
                                            <defs>
                                                <linearGradient
                                                    id="metRevGrad"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#3B82F6"
                                                        stopOpacity={0.4}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#3B82F6"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="m"
                                                tick={{ fontSize: 9, fill: "#64748b" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                {...tooltipStyle}
                                                formatter={(v: number) => [`€${v}k`, "Revenue"]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="v"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                fill="url(#metRevGrad)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* RevPAR widget */}
                    <motion.div variants={cellVariants}>
                        <Card className="h-full bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden group">
                            <div className="p-4 h-full flex flex-col justify-between">
                                <div>
                                    <span className="text-xs text-slate-400">RevPAR</span>
                                    <div className="text-4xl font-bold text-white mt-2">
                                        €107.35
                                    </div>
                                    <div className="text-xs text-amber-400 font-medium mt-1">
                                        ↑ +8.2% vs last month
                                    </div>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/8 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "76%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                                    />
                                </div>
                                <div className="text-xs text-slate-500">
                                    76% of target achieved
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* ADR Trend */}
                    <motion.div variants={cellVariants}>
                        <Card className="h-full bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden group">
                            <div className="p-4 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-white">
                                        ADR Trend
                                    </span>
                                    <span className="text-xs text-cyan-400 font-medium">
                                        €127.50
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Avg Daily Rate (€)
                                </p>
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={adrData}>
                                            <XAxis
                                                dataKey="m"
                                                tick={{ fontSize: 9, fill: "#64748b" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                {...tooltipStyle}
                                                formatter={(v: number) => [`€${v}`, "ADR"]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="v"
                                                stroke="#06B6D4"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Bookings by Channel */}
                    <motion.div variants={cellVariants}>
                        <Card className="h-full bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden group">
                            <div className="p-4 h-full flex flex-col">
                                <div className="mb-1">
                                    <span className="text-xs font-semibold text-white">
                                        Bookings by Channel
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">Share (%)</p>
                                <div className="flex-1 space-y-2">
                                    {channelData.map((c, i) => (
                                        <div key={c.name} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 w-12">
                                                {c.name}
                                            </span>
                                            <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${c.value}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.8,
                                                        delay: 0.2 + i * 0.1,
                                                        ease: "easeOut",
                                                    }}
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-300 w-6">
                                                {c.value}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Lead Time Distribution — full width */}
                    <motion.div
                        variants={cellVariants}
                        className="md:col-span-2 lg:col-span-3"
                    >
                        <Card className="h-full bg-white/[0.03] border-white/8 hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden group">
                            <div className="p-4 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-white">
                                        Lead Time Distribution
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">
                                        Days before check-in
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">
                                    Booking lead time buckets — how far in advance guests book
                                </p>
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={leadTimeData}>
                                            <XAxis
                                                dataKey="days"
                                                tick={{ fontSize: 10, fill: "#64748b" }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                {...tooltipStyle}
                                                formatter={(v: number) => [v, "Bookings"]}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="#8B5CF6"
                                                radius={[3, 3, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
