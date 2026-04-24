"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/hooks/user"
import { api } from "@/lib/api"
import { IconLoader, IconLoader2, IconSparkles } from "@tabler/icons-react"
import { useState } from "react"

const Page = () => {
  const { user, refresh, loading } = useUser()

  const [userName, setUserName] = useState(user?.name)
  const [userExpertise, setUserExpertise] = useState(user?.expertise)
  const [userSqlLevel, setUserSqlLevel] = useState(user?.sql_level)


  const handleUpdate = async () => {
    await api("/user/update", {
      method: "POST",
      body: JSON.stringify({ name: userName, expertise: userExpertise, sql_level: userSqlLevel })
    })
    refresh()
  }

  return (
    <div className="flex flex-col gap-10 px-20 pt-10 w-[60%] mx-auto">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">Account Settings</p>
        <Button>
          <IconSparkles className="text-emerald-600 animate-pulse" />
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
            <form id="user-form" onSubmit={e => {
              e.preventDefault();
              handleUpdate()
            }}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    required
                    defaultValue={user?.name}
                    onChange={e => setUserName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expertise">Expertise</Label>
                  <Input
                    id="expertise"
                    type="expertise"
                    defaultValue={user?.expertise}
                    onChange={e => setUserExpertise(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>SQL Level</Label>
                  <Select value={userSqlLevel} onValueChange={setUserSqlLevel}>
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
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 items-end">
            <Button type="submit" form="user-form" disabled={loading}>
              {loading ? <IconLoader2 className="animate-spin" /> : ""}
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Page
