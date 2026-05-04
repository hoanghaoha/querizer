"use client"

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavGroup } from "./nav-group"
import Link from "next/link"
import { NAV_DATA } from "@/lib/const"
import { NavUser } from "./nav-user"
import { IconPlus } from "@tabler/icons-react"
import GenerateChallengeButton from "../challenges/challenge-generate-button"


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
                <p className="text-lg font-bold">querizer</p>
              </Link>
            }
            <SidebarTrigger size={"lg"} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <GenerateChallengeButton>
              <SidebarMenuButton
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <IconPlus />
                <p className="font-semibold">
                  Challenge
                </p>
              </SidebarMenuButton>
            </GenerateChallengeButton>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavGroup label="Workspace" items={NAV_DATA.workspace} />
        <NavGroup label="Community" items={NAV_DATA.community} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser items={NAV_DATA.user} />
      </SidebarFooter>
    </Sidebar >
  )
}
