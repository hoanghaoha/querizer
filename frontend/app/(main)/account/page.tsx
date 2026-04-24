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
import { IconSparkles } from "@tabler/icons-react"

const Page = () => {
  const { user, refresh, loading } = useUser()

  const handleUpdate = () => {

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
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="name"
                    required
                    defaultValue={user?.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expertise">Expertise</Label>
                  <Input id="expertise" type="expertise" defaultValue={user?.expertise} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expertise">SQL Level</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={user?.sql_level} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2 items-end">
            <Button type="submit">
              Update
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Page
