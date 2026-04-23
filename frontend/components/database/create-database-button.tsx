import { IconDatabase, IconPlus, IconSparkles } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Field, FieldGroup } from "../ui/field"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { DATABASE_INDUSTRY, DATABASE_SIZE } from "@/lib/const"

const GenerateDatabaseButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <IconPlus />
          Generate Database
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconDatabase size={16} />
            Generate a Database
          </DialogTitle>
          <DialogDescription>
            Tell us about your database and AI will generate a realistic schema for you.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g. E-commerce store, Hospital records" />
          </Field>
          <Field>
            <Label htmlFor="industry">Industry</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Industry</SelectLabel>
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
            <Label htmlFor="size">Size</Label>
            <Select>
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

export default GenerateDatabaseButton
