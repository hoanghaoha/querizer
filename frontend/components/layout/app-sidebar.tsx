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
import { navData } from "@/lib/const"
import { NavGroup } from "./nav-group"
import Image from "next/image"
import Link from "next/link"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-between items-center">
            {
              open &&
              <Link className="flex items-center gap-2 px-2" href="/">
                <Image src={"/icon.svg"} alt="Querizer" width={28} height={28} className="hover:animate-pulse hover" />
              </Link>
            }
            <SidebarTrigger size={"lg"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Workspace" items={navData.workspace} />
        <NavGroup label="Community" items={navData.community} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar >
  )
}
