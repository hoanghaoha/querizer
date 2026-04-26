"use client"

import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { sql } from "@codemirror/lang-sql"
import { oneDark } from "@codemirror/theme-one-dark"
import { format } from "sql-formatter"
import {
  IconArrowsVertical,
  IconBackspace,
  IconBulb,
  IconChecks,
  IconClearFormatting,
  IconFlask,
  IconPlayerPlay,
  IconPuzzle,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Challenge, Database, DatabaseQueryData } from "@/lib/types"
import { useDatabaseQuery } from "@/hooks/database"
import { useChallengeHint, useChallengeSubmit } from "@/hooks/challenge"
import ResultDrawer from "./result-drawer"

const SqlEditor = ({ database, challenge }: { database: Database; challenge?: Challenge }) => {
  const [dql, setDql] = useState("SELECT *\nFROM ")
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<DatabaseQueryData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [solved, setSolved] = useState<boolean | null>(null)
  const { query, querying } = useDatabaseQuery()
  const { hint, hinting } = useChallengeHint()
  const { submit, submitting } = useChallengeSubmit()

  const runQuery = async () => {
    if (!dql.trim()) return
    setError(null)
    setSolved(null)
    setResult(null)
    try {
      setResult(await query({ id: database.id, dql }))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Query failed")
    }
    setOpen(true)
  }

  const handleHint = async () => {
    if (!challenge) return
    const text = await hint({ id: challenge.id, database_id: database.id, dql })
    if (!text) return
    setDql(format(text))
  }

  const handleSubmit = async () => {
    if (!challenge) return
    setError(null)
    setResult(null)
    setSolved(null)
    try {
      const data = await submit({ id: challenge.id, database_id: database.id, dql })
      if (data) {
        setResult(data.result)
        setSolved(data.solved)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed")
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
        className="flex-1 text-sm overflow-y-auto"
      />

      <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/20">
        <div className="flex gap-2 items-center">
          {challenge ? (
            <>
              <Button size="sm" variant="outline" disabled={hinting} onClick={handleHint}>
                <IconBulb className="text-yellow-300" />
                {hinting ? "Hinting..." : "Hint"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDql(format(challenge.solution))}>
                <IconPuzzle className="text-purple-300" />
                Solution
              </Button>
            </>
          ) : null}
        </div>

        <div className="flex gap-2">
          {challenge && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDql(dql.split("\n").filter(l => !l.trimStart().startsWith("--")).join("\n"))}
            >
              <IconBackspace />
              Comments
            </Button>
          )}
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
            onClick={runQuery}
            disabled={querying}
            className="border-primary border-2"
          >
            {challenge
              ? <IconFlask className="text-primary" />
              : <IconPlayerPlay className="size-3.5" />}
            {querying ? "Running..." : challenge ? "Try" : "Run"}
          </Button>
          {challenge && (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={submitting}
              className="border-primary border-2"
            >
              <IconChecks />
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </div>

      <ResultDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Query Results"
        data={result}
        loading={querying || submitting}
        error={error}
        solved={solved}
      />
    </div>
  )
}

export default SqlEditor
