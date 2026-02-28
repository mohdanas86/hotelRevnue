"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggleTheme: () => { },
});

export function useDashboardTheme() {
    return useContext(ThemeContext);
}

export function DashboardThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("dashboard-theme") as Theme) ?? "light";
        }
        return "light";
    });

    useEffect(() => {
        localStorage.setItem("dashboard-theme", theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={`${theme} bg-background text-foreground min-h-screen`}>{children}</div>
        </ThemeContext.Provider>
    );
}
