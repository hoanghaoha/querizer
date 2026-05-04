"use client"

import { IconLoader2, IconPlus, IconSparkles } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { CHALLENGE_LEVEL } from "@/lib/const"
import { Input } from "../ui/input"
import { ChallengeLevel } from "@/lib/types"
import { useDatabases } from "@/hooks/database"
import { useChallengeGenerate } from "@/hooks/challenge"
import { useUser } from "@/hooks/user"
import { useState } from "react"
import { useRouter } from "next/navigation"

const GenerateChallengeButton = ({ onSuccess, children }: { onSuccess?: () => void; children?: React.ReactNode }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [databaseId, setDatabaseId] = useState<string | null>(null)
  const [level, setLevel] = useState<ChallengeLevel>("Easy")
  const [topics, setTopics] = useState<string | null>(null)
  const [context, setContext] = useState<string | null>(null)

  const { databases, loading: loadingDatabases, refresh: refreshDatabases } = useDatabases()
  const { user } = useUser()
  const isNewUser = user ? Date.now() - new Date(user.created_at).getTime() < 2 * 60 * 1000 : false
  const { generate, generating } = useChallengeGenerate()

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) refreshDatabases()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <IconPlus />
            Generate Challenge
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Challenge
          </DialogTitle>
          <DialogDescription>
            Tell us about your challenge that you want.
          </DialogDescription>
        </DialogHeader>
        <form id="generate-challenge-form" onSubmit={async (e) => {
          e.preventDefault()
          const challenge = await generate({ database_id: databaseId!, level: level!, topics: topics || "Any topics", context: context || "" })
          if (challenge) {
            onSuccess?.()
            setOpen(false)
            router.push(`/challenges/${challenge.id}`)
          }
        }}>
          <FieldGroup>
            <Field>
              <Label>Database</Label>
              {loadingDatabases ? (
                <p className="text-sm text-muted-foreground">Loading databases...</p>
              ) : !databases?.length ? (
                <p className="text-sm text-muted-foreground">
                  {isNewUser ? "Your starter database is being prepared. Try again in a moment." : (<>No databases yet. <button type="button" className="underline" onClick={() => { setOpen(false); router.push("/databases") }}>Create one</button> to get started.</>)}
                </p>
              ) : (
                <Select value={databaseId || ""} onValueChange={setDatabaseId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Database</SelectLabel>
                      {databases.map(database => (
                        <SelectItem key={database.id} value={database.id}>
                          {database.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </Field>
            <Field>
              <Label htmlFor="industry">Level</Label>
              <Select value={level || ""} onValueChange={(v) => setLevel(v as ChallengeLevel)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Level</SelectLabel>
                    {CHALLENGE_LEVEL.map(level => (
                      <SelectItem key={level.title} value={level.title}>
                        <level.icon className={level.color} />
                        {level.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="topics">SQL topics</Label>
              <Input
                id="topics"
                name="topics"
                placeholder="e.g. SELECT, JOINs, GROUP BY, CTEs, window functions, ..."
                onChange={(e) => setTopics(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="description">Additional context <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g. Multi-tenant SaaS with users, subscriptions, and audit logs"
                className="max-h-48 overflow-y-auto"
                onChange={(e) => setContext(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="generate-challenge-form" disabled={generating}>
            {generating ? <IconLoader2 className="animate-spin" /> : <IconSparkles />}
            {generating ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateChallengeButton
