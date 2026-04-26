"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { IconArrowsVertical, IconBackspace, IconBulb, IconChecks, IconClearFormatting, IconFlask, IconPlayerPlay, IconPuzzle, IconX } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { format } from "sql-formatter"
import { Challenge, Database, DatabaseQueryData } from "@/lib/types"
import { useDatabaseQuery } from "@/hooks/database"
import { useChallengeHint, useChallengeSubmit } from "@/hooks/challenge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer"

interface QueryResult {
  columns: string[]
  rows: unknown[][]
}

const ResultTable = ({ result }: { result: QueryResult }) => (
  result.rows.length === 0
    ? <p className="text-sm text-muted-foreground px-2">Query returned 0 rows.</p>
    : <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-muted sticky top-0">
          {result.columns.map(col => (
            <th key={col} className="text-left px-3 py-2 border border-border font-medium text-muted-foreground whitespace-nowrap">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.rows.map((row, i) => (
          <tr key={i} className="hover:bg-muted/50">
            {(row as unknown[]).map((cell, j) => (
              <td key={j} className="px-3 py-1.5 border border-border whitespace-nowrap">
                {cell === null
                  ? <span className="text-muted-foreground italic">null</span>
                  : String(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
)

const SqlEditor = ({ database, challenge }: { database: Database, challenge: Challenge }) => {
  const [open, setOpen] = useState(false)
  const [dql, setDql] = useState("SELECT * FROM")
  const [result, setResult] = useState<DatabaseQueryData | null>(null)
  const { query, querying } = useDatabaseQuery()
  const { hint, hinting } = useChallengeHint()
  const { submit, submitting } = useChallengeSubmit()

  const handleHint = async () => {
    const result = await hint({ id: challenge.id, database_id: database.id, dql: dql })
    const hintText = result!.split("\n").map((line) => "-- " + line)
    setDql(format(hintText.join("\n") + "\n" + dql))
  }

  const handleSubmit = async () => {
    const result = await submit({ id: challenge.id, database_id: database.id, dql: dql })
    setResult(result?.result!)
    setOpen(true)
  }

  return (
    <div className="flex flex-col h-full">
      <CodeMirror
        value={dql}
        onChange={setDql}
        extensions={[sql()]}
        theme={oneDark}
        basicSetup={{ lineNumbers: true, foldGutter: false }}
        className="flex-1 text-sm overflow-y-auto"
      />

      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
        <>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={hinting} onClick={handleHint}>
              <IconBulb className="text-yellow-300" />
              {hinting ? "Hinting..." : "Hint"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDql(format(challenge.solution))}>
              <IconPuzzle className="text-purple-300" />
              Solution
            </Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setDql(dql.split("\n").filter(l => !l.startsWith("--")).join("\n"))}>
              <IconBackspace />
              Comments
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDql(format(dql))}>
              <IconClearFormatting />
              Format
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
              <IconArrowsVertical />
              Result
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={async () => await query({ id: database.id, dql: dql })}
              disabled={querying}
              className="border-primary border-2"
            >
              <IconFlask className="text-primary" />
              {querying ? "Running..." : "Try"}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={true}
              className="border-primary border-2"
            >
              <IconChecks />
              Submit
            </Button>
          </div>
        </>
      </div>
      <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="flex flex-row items-center justify-between py-2 px-4">
            <DrawerTitle className={`text-sm font-semibold`}>
              RESULT
            </DrawerTitle>
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setOpen(false)}>
              <IconX className="size-3.5" />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto flex-1 px-2 pb-4">
            <ResultTable result={result!} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default SqlEditor
