"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "../ui/navigation-menu"
import { useRouter } from "next/navigation"

const NavBar = () => {
  const router = useRouter()
  return (
    <div className="sticky top-0 flex items-center justify-between py-2 px-4 md:px-16 w-full bg-background border-b">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/icon.svg" alt="querizer" width={28} height={28} className="rounded-md" />
        <p className="font-semibold">querizer</p>
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="flex">
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/#features">Features</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/#pricing">Pricing</Link>
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
