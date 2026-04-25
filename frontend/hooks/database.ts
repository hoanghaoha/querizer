"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Database, DatabaseQueryData } from "@/lib/types"

export function useDatabases() {
  const [loading, setLoading] = useState(false)
  const [databases, setDatabases] = useState<Database[] | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const databases = await api("/database/databases", { method: "GET" }) as Database[]
      setDatabases(databases)
    } catch {
      toast.error("Fail to get databases - see console for details")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { databases, loading, refresh: load }

}

export function useDatabase(id: string) {
  const [loading, setLoading] = useState(false)
  const [database, setDatabase] = useState<Database | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const database = await api(`/database/${id}`, { method: "GET" }) as Database
      setDatabase(database)
    } catch {
      toast.error("Fail to get database - see console for details")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { database, loading }
}

export function useDatabaseGenerate(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false)

  const generate = async (data: {
    name: string | null
    industry: string | null
    size: string | null
    description: string | null
  }) => {
    setLoading(true)
    try {
      await api("/database", {
        method: "POST",
        body: JSON.stringify(data),
      })
      toast.success("Database generated")
      onSuccess?.()
    } catch {
      toast.error("Failed to generate database — see console for details")
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading }
}

export function useDatabaseQuery({ id, dql }: { id: string, dql: string }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DatabaseQueryData | null>(null)

  const query = useCallback(async () => {
    setLoading(true)
    try {
      const result = await api(`/database/query/${id}`, { method: "POST", body: JSON.stringify({ dql }) })
      setData(result)
    } catch {
      toast.error("Failed to query database - see console for details")
    } finally {
      setLoading(false)
    }
  }, [id, dql])

  useEffect(() => { query() }, [query])

  return { data, loading }
}
