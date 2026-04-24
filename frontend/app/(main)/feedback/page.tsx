"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { IconLoader2 } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "sonner"

const Page = () => {
  const [type, setType] = useState("General")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFeedback = async () => {
    setLoading(true)
    try {
      api("/feedback", { method: "POST", body: JSON.stringify({ "type": type, "message": msg }) })
    } finally {
      toast.success("Your feedback has sent")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10 px-20 pt-10 w-[60%] mx-auto">
      <div className="flex justify-between items-start">
        <p className="font-bold text-xl">Feedback</p>
      </div>
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>What do you want us to do?</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" id="user-form" onSubmit={e => {
              e.preventDefault();
              handleFeedback()
            }}>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={type} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="features">Request features</SelectItem>
                      <SelectItem value="bug">Report a bug</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  defaultValue={msg}
                  onChange={e => setMsg(e.target.value)}
                />
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
