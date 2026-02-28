"use client";

import React, { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardThemeProvider } from "@/components/dashboard/DashboardThemeProvider";

export default function DashboardPage() {
  return (
    <DashboardThemeProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col">
            <Suspense fallback={null}>
              <DashboardLayout />
            </Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardThemeProvider>
  );
}
