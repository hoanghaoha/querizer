"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { IconTrash, IconDeviceFloppy } from "@tabler/icons-react"
import { Field, FieldGroup } from "../ui/field"
import { Database } from "@/lib/types"
import { useDatabaseDelete, useDatabaseUpdate } from "@/hooks/database"
import { useRouter } from "next/navigation"

const DatabaseSettings = (database: Database) => {
  const router = useRouter()
  const [name, setName] = useState(database?.name)
  const [description, setDescription] = useState(database?.description ?? "")
  const { update, updating } = useDatabaseUpdate()
  const { deleteDatabase, deleting } = useDatabaseDelete(() => router.push("/databases"))

  return (
    <div className="flex flex-col gap-6 max-w-lg p-4">
      <FieldGroup>
        <Field>
          <Label htmlFor="ds-name">Name</Label>
          <Input
            id="ds-name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="ds-description">Description</Label>
          <Textarea
            id="ds-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </Field>
        <Field>
          <Label>Industry</Label>
          <Input value={database?.industry ?? "—"} disabled />
        </Field>
        <Field>
          <Label>Size</Label>
          <Input value={database?.size ?? "—"} disabled />
        </Field>
        <Field>
          <Label>Row Count</Label>
          <Input value={database?.row_count.toLocaleString()} disabled />
        </Field>
      </FieldGroup>

      <div className="flex items-center justify-between">
        <Button
          variant="destructive"
          onClick={() => deleteDatabase({ id: database.id })}
          disabled={deleting}
        >
          <IconTrash />
          {deleting ? "Deleting..." : "Delete Database"}
        </Button>
        <Button
          onClick={() => update({ id: database.id, name: name, description: description })}
          disabled={updating}
        >
          <IconDeviceFloppy />
          {updating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

export default DatabaseSettings
