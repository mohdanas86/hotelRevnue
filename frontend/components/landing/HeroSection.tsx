"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    ChevronDown,
    TrendingUp,
    DollarSign,
    Users,
    BarChart2,
    Activity,
    Wifi,
} from "lucide-react";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
} from "recharts";

const areaData = [
    { month: "Aug", revenue: 42000, occupancy: 68 },
    { month: "Sep", revenue: 55000, occupancy: 74 },
    { month: "Oct", revenue: 48000, occupancy: 71 },
    { month: "Nov", revenue: 63000, occupancy: 80 },
    { month: "Dec", revenue: 87000, occupancy: 91 },
    { month: "Jan", revenue: 72000, occupancy: 85 },
    { month: "Feb", revenue: 94000, occupancy: 93 },
];

const barData = [
    { channel: "OTA", value: 45 },
    { channel: "Direct", value: 30 },
    { channel: "Corp", value: 15 },
    { channel: "GDS", value: 10 },
];

const kpiItems = [
    {
        icon: DollarSign,
        label: "Total Revenue",
        value: "€94,280",
        change: "+12.4%",
        positive: true,
    },
    {
        icon: Users,
        label: "Occupancy Rate",
        value: "84.2%",
        change: "+3.1%",
        positive: true,
    },
    {
        icon: TrendingUp,
        label: "ADR",
        value: "€127.50",
        change: "+5.8%",
        positive: true,
    },
    {
        icon: BarChart2,
        label: "RevPAR",
        value: "€107.35",
        change: "+8.2%",
        positive: true,
    },
];

export function HeroSection() {
    const handleScrollDown = () => {
        const el = document.querySelector("#features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1E] pt-16">
            {/* Background radial glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-cyan-400/8 blur-[80px]" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Text content */}
                <div className="text-center mb-12">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex justify-center mb-6"
                    >
                        <Badge
                            variant="outline"
                            className="border-blue-500/30 bg-blue-500/10 text-blue-300 px-4 py-1.5 text-xs tracking-wide gap-2"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                            </span>
                            <Wifi className="w-3 h-3" />
                            Live Data • Updated in Real-Time
                        </Badge>
                    </motion.div>

                    {/* H1 */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6"
                    >
                        Turn Hotel Data Into
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                            Revenue Intelligence
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        The analytics dashboard built for hotel revenue managers. Track ADR,
                        RevPAR, occupancy, and booking channels — all filtered to your exact
                        needs, in real-time.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white border-0 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 text-base px-8 h-12 gap-2 font-medium"
                            >
                                Open Dashboard
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleScrollDown}
                            className="border-white/15 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/25 bg-white/5 text-base px-8 h-12 gap-2 transition-all duration-300"
                        >
                            See What&apos;s Inside
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Dashboard Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Glow behind mockup */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-cyan-400/10 to-teal-500/20 rounded-2xl blur-2xl" />

                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative rounded-xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden bg-[#0D1526]"
                    >
                        {/* Mockup Header Bar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#0A0F1E]/60">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="bg-white/5 border border-white/8 rounded px-3 py-1 text-xs text-slate-500 w-64 flex items-center gap-2">
                                    <Activity className="w-3 h-3 text-blue-400" />
                                    hotelrevenue.app/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Mockup Body */}
                        <div className="p-4 sm:p-6">
                            {/* KPI Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                {kpiItems.map((kpi) => (
                                    <div
                                        key={kpi.label}
                                        className="bg-white/5 border border-white/8 rounded-lg p-3"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-400">
                                                {kpi.label}
                                            </span>
                                            <kpi.icon className="w-3.5 h-3.5 text-blue-400" />
                                        </div>
                                        <div className="text-lg font-bold text-white">
                                            {kpi.value}
                                        </div>
                                        <div
                                            className={`text-xs font-medium mt-0.5 ${kpi.positive ? "text-emerald-400" : "text-red-400"}`}
                                        >
                                            {kpi.change} vs last period
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                                {/* Revenue trend chart */}
                                <div className="lg:col-span-2 bg-white/5 border border-white/8 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-medium text-white">
                                            Revenue Trend
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-xs px-2 py-0"
                                        >
                                            +12.4%
                                        </Badge>
                                    </div>
                                    <div className="h-28">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={areaData}>
                                                <defs>
                                                    <linearGradient
                                                        id="heroGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.3}
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
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#0D1526",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                        color: "#fff",
                                                    }}
                                                    formatter={(v: number) => [`€${v.toLocaleString()}`, "Revenue"]}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="#3B82F6"
                                                    strokeWidth={2}
                                                    fill="url(#heroGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Channel bar chart */}
                                <div className="bg-white/5 border border-white/8 rounded-lg p-3">
                                    <div className="mb-3">
                                        <span className="text-xs font-medium text-white">
                                            Booking Channels
                                        </span>
                                    </div>
                                    <div className="h-28">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} layout="vertical">
                                                <XAxis
                                                    type="number"
                                                    tick={{ fontSize: 8, fill: "#64748b" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="channel"
                                                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    width={30}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: "#0D1526",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        borderRadius: "8px",
                                                        fontSize: "11px",
                                                        color: "#fff",
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    fill="#06B6D4"
                                                    radius={[0, 3, 3, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={handleScrollDown}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Scroll down"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-6 h-6" />
                </motion.div>
            </motion.button>
        </section>
    );
}
