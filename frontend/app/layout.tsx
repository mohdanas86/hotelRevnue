import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Hotel Revenue Management",
  description: "Analytics dashboard for hotel revenue insights and performance",
  keywords: ["hotel", "revenue", "analytics", "dashboard", "management"],
  authors: [{ name: "Hotel Revenue Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <QueryProvider>
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
