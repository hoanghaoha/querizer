"use client"

import { useMemo, useState } from "react"
import DatabaseCard from "@/components/database/database-card"
import GenerateDatabaseButton from "@/components/database/database-generate-button"
import { useDatabases } from "@/hooks/database"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DATABASE_INDUSTRY, DATABASE_SIZE } from "@/lib/const"
import type { DatabaseIndustry, DatabaseSize } from "@/lib/types"

const Page = () => {
  const { databases, refresh } = useDatabases()
  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState<DatabaseIndustry | "all">("all")
  const [size, setSize] = useState<DatabaseSize | "all">("all")
  const [sort, setSort] = useState<"newest" | "oldest" | "name-asc" | "name-desc">("newest")

  const filtered = useMemo(() => {
    if (!databases) return []
    return databases
      .filter(db => {
        const q = search.toLowerCase()
        const matchSearch = !q || db.name.toLowerCase().includes(q) || db.description?.toLowerCase().includes(q)
        const matchIndustry = industry === "all" || db.industry === industry
        const matchSize = size === "all" || db.size === size
        return matchSearch && matchIndustry && matchSize
      })
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        if (sort === "name-asc") return a.name.localeCompare(b.name)
        return b.name.localeCompare(a.name)
      })
  }, [databases, search, industry, size, sort])

  return (
    <div className="flex flex-col gap-8 pt-10 mx-auto w-[60%]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl">My Databases</p>
        <GenerateDatabaseButton onClick={refresh} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search databases..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={industry} onValueChange={v => setIndustry(v as DatabaseIndustry | "all")}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {DATABASE_INDUSTRY.map(i => (
              <SelectItem key={i.title} value={i.title}>{i.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={size} onValueChange={v => setSize(v as DatabaseSize | "all")}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {DATABASE_SIZE.map(s => (
              <SelectItem key={s.title} value={s.title}>{s.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={v => setSort(v as typeof sort)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name-asc">Name A→Z</SelectItem>
            <SelectItem value="name-desc">Name Z→A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {filtered.map(database => (
          <DatabaseCard key={database.id} {...database} />
        ))}
        {filtered.length === 0 && databases && (
          <p className="col-span-2 text-center text-sm text-muted-foreground py-10">No databases found.</p>
        )}
      </div>
    </div>
  )
}

export default Page
