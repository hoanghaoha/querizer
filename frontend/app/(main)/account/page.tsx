"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser, useUserUpdate } from "@/hooks/user"
import { IconLoader2, IconSparkles } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = () => {
  const { user, refresh } = useUser()
  const { update, updating } = useUserUpdate(refresh)

  const [name, setName] = useState(user?.name)
  const [expertise, setExpertise] = useState(user?.expertise)
  const [sqlLevel, setSqlLevel] = useState(user?.sql_level)
  const router = useRouter()

  useEffect(() => {
    setName(user?.name)
    setExpertise(user?.expertise)
    setSqlLevel(user?.sql_level)
  }, [user])

  return (
    <div className="flex flex-col gap-10 px-20 pt-10 w-[60%] mx-auto">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">Account Settings</p>
        <Button>
          <IconSparkles className="text-emerald-600 animate-pulse" onClick={() => router.push("/plan")} />
          Upgrade Plan
        </Button>
      </div>
      <div className="w-full">
        <Item variant="outline">
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{user?.name}</ItemTitle>
            <ItemDescription>{user?.email}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant={"outline"} className={user?.plan == "Pro" ? "bg-emerald-300" : ""}>{user?.plan}</Badge>
          </ItemActions>
        </Item>
      </div>
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Your information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" id="user-form" onSubmit={async (e) => {
              e.preventDefault()
              await update({ name: name, expertise: expertise, sql_level: sqlLevel })
            }}>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={name ?? ""}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expertise">Expertise</Label>
                <Input
                  id="expertise"
                  value={expertise ?? ""}
                  onChange={e => setExpertise(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>SQL Level</Label>
                <Select value={sqlLevel} onValueChange={setSqlLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={user?.sql_level} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 items-end">
            <Button type="submit" form="user-form" disabled={updating}>
              {updating ? <IconLoader2 className="animate-spin" /> : ""}
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Page
