"use client";

import React from "react";
import { motion } from "framer-motion";
import { FloatingKPICard } from "./FloatingKPICard";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

const revenueData = [
    { month: "Jul", value: 38000 },
    { month: "Aug", value: 45000 },
    { month: "Sep", value: 52000 },
    { month: "Oct", value: 49000 },
    { month: "Nov", value: 61000 },
    { month: "Dec", value: 88000 },
    { month: "Jan", value: 74000 },
    { month: "Feb", value: 94000 },
];

const occupancyData = [
    { month: "Aug", rate: 68 },
    { month: "Sep", rate: 74 },
    { month: "Oct", rate: 71 },
    { month: "Nov", rate: 80 },
    { month: "Dec", rate: 91 },
    { month: "Jan", rate: 85 },
    { month: "Feb", rate: 93 },
];

const channelData = [
    { name: "OTA", value: 45, color: "#3B82F6" },
    { name: "Direct", value: 30, color: "#06B6D4" },
    { name: "Corporate", value: 15, color: "#8B5CF6" },
    { name: "GDS", value: 10, color: "#F59E0B" },
];

export function DashboardPreview() {
    return (
        <section className="relative bg-[#080D1A] py-24 sm:py-32 overflow-hidden">
            {/* background accent band */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-[#080D1A] to-[#0A0F1E]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/8 text-cyan-400 text-xs font-medium mb-4">
                        Live Preview
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                        See Your Revenue Story at a Glance
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Every chart is interactive, every filter updates in real-time, every
                        insight is a click away.
                    </p>
                </motion.div>

                {/* Mockup with floating KPI cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Floating KPI Cards — hidden on mobile to avoid overlap */}
                    <div className="hidden xl:block">
                        <FloatingKPICard
                            label="Monthly Revenue"
                            value="€94,280"
                            change="+12.4% vs last month"
                            positive
                            delay={0.3}
                            animateFrom="left"
                            className="-left-8 top-12 z-20"
                        />
                        <FloatingKPICard
                            label="Occupancy Rate"
                            value="84.2%"
                            change="+3.1% vs last month"
                            positive
                            delay={0.45}
                            animateFrom="right"
                            className="-right-8 top-12 z-20"
                        />
                        <FloatingKPICard
                            label="Avg Daily Rate"
                            value="€127.50"
                            change="+5.8% vs last month"
                            positive
                            delay={0.6}
                            animateFrom="left"
                            className="-left-8 bottom-20 z-20"
                        />
                    </div>

                    {/* Main mock dashboard */}
                    <div className="relative rounded-xl border border-white/10 bg-[#0D1526] shadow-2xl shadow-black/50 overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20 opacity-60 blur-sm pointer-events-none" />

                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/8 bg-[#0A0F1E]/50">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-xs text-slate-500 ml-3">
                                Hotel Revenue Dashboard — Analytics Overview
                            </span>
                        </div>

                        {/* Dashboard content */}
                        <div className="p-5 sm:p-6 space-y-4">
                            {/* Filter bar mockup */}
                            <div className="flex flex-wrap gap-2">
                                {["Feb 2026", "All Hotels", "All Room Types", "All Channels"].map(
                                    (f) => (
                                        <div
                                            key={f}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/8 rounded-lg text-xs text-slate-300"
                                        >
                                            {f}
                                            <span className="text-white/30">▾</span>
                                        </div>
                                    ),
                                )}
                            </div>

                            {/* Charts grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Revenue area chart */}
                                <div className="lg:col-span-2 bg-white/[0.03] border border-white/8 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-white">
                                            Revenue Over Time
                                        </span>
                                        <span className="text-xs text-emerald-400 font-medium">
                                            €94,280 total
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">
                                        Jul 2025 → Feb 2026
                                    </p>
                                    <div className="h-36">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={revenueData}>
                                                <defs>
                                                    <linearGradient
                                                        id="revGrad"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.35}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 9, fill: "#64748b" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    tick={{ fontSize: 9, fill: "#64748b" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                                                    width={38}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#0D1526",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                        color: "#fff",
                                                    }}
                                                    formatter={(v: number) => [
                                                        `€${v.toLocaleString()}`,
                                                        "Revenue",
                                                    ]}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#3B82F6"
                                                    strokeWidth={2}
                                                    fill="url(#revGrad)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Channel pie */}
                                <div className="bg-white/[0.03] border border-white/8 rounded-lg p-4">
                                    <div className="mb-1">
                                        <span className="text-xs font-semibold text-white">
                                            Booking Channels
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">Share of bookings</p>
                                    <div className="h-24 flex items-center justify-center">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={channelData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={28}
                                                    outerRadius={44}
                                                    dataKey="value"
                                                    strokeWidth={0}
                                                >
                                                    {channelData.map((entry) => (
                                                        <Cell key={entry.name} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#0D1526",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                        color: "#fff",
                                                    }}
                                                    formatter={(v) => [`${v}%`, ""]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {channelData.map((c) => (
                                            <div key={c.name} className="flex items-center gap-2">
                                                <span
                                                    className="w-2 h-2 rounded-full flex-shrink-0"
                                                    style={{ background: c.color }}
                                                />
                                                <span className="text-xs text-slate-400 flex-1">
                                                    {c.name}
                                                </span>
                                                <span className="text-xs font-medium text-slate-300">
                                                    {c.value}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Occupancy bar */}
                                <div className="lg:col-span-3 bg-white/[0.03] border border-white/8 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-white">
                                            Monthly Occupancy Rate
                                        </span>
                                        <span className="text-xs text-cyan-400 font-medium">
                                            Avg. 80.3%
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">
                                        6-month trend (%)
                                    </p>
                                    <div className="h-24">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={occupancyData}>
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 9, fill: "#64748b" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    domain={[50, 100]}
                                                    tick={{ fontSize: 9, fill: "#64748b" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(v) => `${v}%`}
                                                    width={32}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#0D1526",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                        color: "#fff",
                                                    }}
                                                    formatter={(v) => [`${v}%`, "Occupancy"]}
                                                />
                                                <Bar dataKey="rate" fill="#06B6D4" radius={[3, 3, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
