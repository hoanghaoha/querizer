"use client"

import { useMemo, useState } from "react"
import ChallengeCard from "@/components/challenges/challenge-card"
import GenerateChallengeButton from "@/components/challenges/challenge-generate-button"
import { useChallenges } from "@/hooks/challenge"
import { useDatabases } from "@/hooks/database"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CHALLENGE_LEVEL } from "@/lib/const"
import type { ChallengeLevel } from "@/lib/types"

const LEVEL_ORDER: ChallengeLevel[] = ["Beginner", "Easy", "Medium", "Hard", "Hell"]

const Page = () => {
  const { challenges, refresh } = useChallenges()
  const { databases } = useDatabases()
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState<ChallengeLevel | "all">("all")
  const [databaseId, setDatabaseId] = useState<string | "all">("all")
  const [sort, setSort] = useState<"name-asc" | "name-desc" | "level-asc" | "level-desc">("level-asc")

  const filtered = useMemo(() => {
    if (!challenges) return []
    return challenges
      .filter(c => {
        const q = search.toLowerCase()
        const matchSearch = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.topics.some(t => t.toLowerCase().includes(q))
        const matchLevel = level === "all" || c.level === level
        const matchDatabase = databaseId === "all" || c.database_id === databaseId
        return matchSearch && matchLevel && matchDatabase
      })
      .sort((a, b) => {
        if (sort === "name-asc") return a.name.localeCompare(b.name)
        if (sort === "name-desc") return b.name.localeCompare(a.name)
        if (sort === "level-asc") return LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level)
        return LEVEL_ORDER.indexOf(b.level) - LEVEL_ORDER.indexOf(a.level)
      })
  }, [challenges, search, level, databaseId, sort])

  return (
    <div className="flex flex-col gap-8 pt-10 mx-auto w-[60%]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">My Challenges</p>
        <GenerateChallengeButton onSuccess={refresh} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search challenges..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={level} onValueChange={v => setLevel(v as ChallengeLevel | "all")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {CHALLENGE_LEVEL.map(l => (
              <SelectItem key={l.title} value={l.title}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={databaseId} onValueChange={setDatabaseId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Database" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Databases</SelectItem>
            {databases?.map(db => (
              <SelectItem key={db.id} value={db.id}>{db.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={v => setSort(v as typeof sort)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="level-asc">Easiest first</SelectItem>
            <SelectItem value="level-desc">Hardest first</SelectItem>
            <SelectItem value="name-asc">Name A→Z</SelectItem>
            <SelectItem value="name-desc">Name Z→A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onUpdated={refresh}
            onDeleted={refresh}
          />
        ))}
        {filtered.length === 0 && challenges && (
          <p className="text-center text-sm text-muted-foreground py-10">No challenges found.</p>
        )}
      </div>
    </div>
  )
}

export default Page
