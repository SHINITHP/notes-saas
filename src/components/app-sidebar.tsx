"use client";

import * as React from "react";
import { Notebook, User2, Crown } from "lucide-react";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { TenantData, UserData } from "@/lib/types";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  tenant: TenantData;
  user: UserData;
}

export function AppSidebar({ tenant, user, ...props }: AppSidebarProps) {
  const projects = [
    {
      name: "Notes",
      url: "/notes",
      icon: Notebook,
    },
    ...(user.role === "ADMIN"
      ? [
          {
            name: "Members",
            url: "/members",
            icon: User2,
          },
          {
            name: "Subscriptions",
            url: "/subscription",
            icon: Crown,
          },
        ]
      : []),
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[tenant]} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}