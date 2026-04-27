"use client"

import { IconLoader2, IconPlus, IconSparkles } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { DATABASE_INDUSTRY, DATABASE_SIZE } from "@/lib/const"
import { useState } from "react"
import { useDatabaseGenerate } from "@/hooks/database"

const GenerateDatabaseButton = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string | null>(null)
  const [industry, setIndustry] = useState<string | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const { generate, generating } = useDatabaseGenerate(() => {
    setOpen(false)
    onSuccess?.()
  })

  const handleGenerate = async (e: React.SubmitEvent) => {
    e.preventDefault()
    await generate({ name, industry, size, description })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus />
          Generate Database
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Database
          </DialogTitle>
          <DialogDescription>
            Tell us about your database that you want.
          </DialogDescription>
        </DialogHeader>
        <form id="generate-database-form" onSubmit={handleGenerate} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                required
                id="name"
                name="name"
                placeholder="e.g. E-commerce store, Hospital records"
                onChange={e => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label>Industry</Label>
              <Select required value={industry ?? ""} onValueChange={setIndustry}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DATABASE_INDUSTRY.map(industry => (
                      <SelectItem key={industry.title} value={industry.title}>
                        <industry.icon />
                        {industry.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label>Size</Label>
              <Select required value={size ?? ""} onValueChange={setSize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Size</SelectLabel>
                    {DATABASE_SIZE.map(size => (
                      <SelectItem key={size.title} value={size.title}>
                        <size.icon />
                        {size.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="description">
                Additional context{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                onChange={e => setDescription(e.target.value)}
                id="description"
                placeholder="e.g. Multi-tenant SaaS with users, subscriptions, and audit logs"
                className="max-h-48 overflow-y-auto"
              />
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="generate-database-form" type="submit" disabled={generating}>
            {generating
              ? <IconLoader2 className="animate-spin" />
              : <IconSparkles />
            }
            {generating ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateDatabaseButton
