"use client"

import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavGroup } from "./nav-group"
import Link from "next/link"
import { NAV_DATA } from "@/lib/const"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center">
            {
              open &&
              <Link className="px-2" href="/">
                <p className="text-lg font-bold">Querizer</p>
              </Link>
            }
            <SidebarTrigger size={"lg"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Workspace" items={NAV_DATA.workspace} />
        <NavGroup label="Community" items={NAV_DATA.community} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar >
  )
}
