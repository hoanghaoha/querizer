"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { useRouter } from "next/navigation"

const NavBar = () => {
  const router = useRouter()
  return (
    <div className="sticky top-0 flex items-center justify-between py-2 px-28 w-full bg-background border-b">
      <div>
        <p className="font-semibold">querizer</p>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="flex">
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="#features">Features</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="#usage">Usage</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="#pricing">Pricing</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div>
        <Button onClick={() => router.push("/signin")}>
          Sign in
        </Button>
      </div>

    </div>
  )
}

export default NavBar
