"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
    value: number;
    suffix: string;
    prefix?: string;
    label: string;
    description: string;
}

const stats: Stat[] = [
    {
        value: 100000,
        suffix: "+",
        label: "Bookings Analyzed",
        description: "Across all properties & channels",
    },
    {
        value: 50,
        suffix: "M+",
        prefix: "€",
        label: "Revenue Tracked",
        description: "In total booking value",
    },
    {
        value: 2,
        suffix: "M+",
        label: "Data Points Processed",
        description: "From check-in to check-out",
    },
    {
        value: 20,
        suffix: "+",
        label: "Metrics Available",
        description: "KPIs ready out of the box",
    },
];

function CountUp({
    target,
    prefix = "",
    suffix = "",
    active,
}: {
    target: number;
    prefix?: string;
    suffix?: string;
    active: boolean;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!active) return;
        const duration = 1800;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [active, target]);

    const formatted =
        target >= 1000 ? (count / 1000).toFixed(0) + "k" : count.toString();
    const display =
        target >= 1000000
            ? (count / 1000000).toFixed(1)
            : target >= 1000
                ? Math.floor(count / 1000).toString()
                : count.toString();

    return (
        <span>
            {prefix}
            {target >= 1000000
                ? display
                : target >= 1000
                    ? display
                    : count}
            {target >= 1000 && target < 1000000 ? "k" : ""}
            {suffix}
        </span>
    );
}

export function StatsBar() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section ref={ref} className="relative bg-[#0A0F1E] border-y border-white/8">
            {/* subtle lighter band */}
            <div className="absolute inset-0 bg-white/[0.02]" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`text-center ${i < stats.length - 1
                                    ? "lg:border-r lg:border-white/8 lg:pr-8"
                                    : ""
                                }`}
                        >
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-1 tabular-nums">
                                <CountUp
                                    target={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                    active={isInView}
                                />
                            </div>
                            <div className="text-sm font-semibold text-slate-200 mb-1">
                                {stat.label}
                            </div>
                            <div className="text-xs text-slate-500">{stat.description}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
