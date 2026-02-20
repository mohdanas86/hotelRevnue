"use client";

import * as React from "react";
import { IconDashboard, IconHome } from "@tabler/icons-react";
import { Home } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  // user: {
  //   name: "Admin",
  //   email: "admin@example.com",
  //   avatar: "/avatars/default.jpg",
  // },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Home",
      url: "/",
      icon: IconHome,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="!p-1.5">
              <span className="text-base font-semibold">Hotel Revenue</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
