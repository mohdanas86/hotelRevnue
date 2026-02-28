"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface FloatingKPICardProps {
    label: string;
    value: string;
    change: string;
    positive?: boolean;
    delay?: number;
    className?: string;
    animateFrom?: "left" | "right" | "bottom";
}

export function FloatingKPICard({
    label,
    value,
    change,
    positive = true,
    delay = 0,
    className = "",
    animateFrom = "bottom",
}: FloatingKPICardProps) {
    const initial =
        animateFrom === "left"
            ? { opacity: 0, x: -30 }
            : animateFrom === "right"
                ? { opacity: 0, x: 30 }
                : { opacity: 0, y: 20 };

    return (
        <motion.div
            initial={initial}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className={`absolute backdrop-blur-md bg-white/[0.06] border border-white/12 rounded-xl p-3 shadow-xl ${className}`}
        >
            <div className="text-xs text-slate-400 mb-0.5 whitespace-nowrap">
                {label}
            </div>
            <div className="text-base font-bold text-white">{value}</div>
            <div
                className={`flex items-center gap-0.5 mt-0.5 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
            >
                {positive ? (
                    <TrendingUp className="w-3 h-3" />
                ) : (
                    <TrendingDown className="w-3 h-3" />
                )}
                {change}
            </div>
        </motion.div>
    );
}
