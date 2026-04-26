"use client"

import { useState } from "react"
import { IconArrowsVertical, IconClearFormatting, IconPlayerPlay } from "@tabler/icons-react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { format } from "sql-formatter"
import { Database, DatabaseQueryData } from "@/lib/types"
import { Button } from "../ui/button"
import { useDatabaseQuery } from "@/hooks/database"
import QueryResultDrawer from "./query-result-drawer"

const DatabaseSqlEditor = (database: Database) => {
  const [dql, setDql] = useState("SELECT *\nFROM ")
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<DatabaseQueryData | null>(null)
  const { query, querying } = useDatabaseQuery()

  const runQuery = async () => {
    if (!dql.trim()) return
    setError(null)
    const id = database.id
    const data = await query({ id, dql })
    if (data) {
      setResult(data)
    } else {
      setError("Query failed")
    }
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
        onKeyDown={e => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault()
            runQuery()
          }
        }}
        className="flex-1 text-sm overflow-y-auto"
      />

      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
        <>
          <span className="text-xs text-muted-foreground">Ctrl+Enter to run</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setDql(format(dql))}>
              <IconClearFormatting />
              Format
            </Button>
            <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
              <IconArrowsVertical />
              Result
            </Button>
            <Button size="sm" onClick={runQuery} disabled={querying}>
              <IconPlayerPlay className="size-3.5" />
              {querying ? "Running..." : "Run"}
            </Button>
          </div>
        </>
      </div>
      <QueryResultDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Query Results"
        data={result}
        loading={querying}
        error={error}
      />
    </div>
  )
}

export default DatabaseSqlEditor
