import { IconPlus, IconSparkles } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { CHALLENGE_LEVEL, DATABASE_INDUSTRY, DATABASE_SIZE } from "@/lib/const"
import { Input } from "../ui/input"

const GenerateChallengeButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconPlus />
          Generate Challenge
        </Button>
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
        <FieldGroup>
          <Field>
            <Label htmlFor="industry">Level</Label>
            <Select>
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
            <Input id="topics" name="topics" placeholder="e.g. SELECT, JOINs, GROUP BY, CTEs, window functions, ..."></Input>
          </Field>
          <Field>
            <Label htmlFor="description">Additional context <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea id="description" name="description" placeholder="e.g. Multi-tenant SaaS with users, subscriptions, and audit logs" className="max-h-48 overflow-y-auto" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">
            <IconSparkles />
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateChallengeButton
