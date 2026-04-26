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
    if (!id) return
    setLoading(true)
    try {
      const database = await api(`/database/${id}`, { method: "GET" }) as Database
      setDatabase(database)
    } catch {
      toast.error("Fail to get database - see console for details")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  return { database, loading, refresh: load }
}

export function useDatabaseGenerate(onSuccess?: () => void) {
  const [generating, setGenerating] = useState(false)

  const generate = async (data: {
    name: string | null
    industry: string | null
    size: string | null
    description: string | null
  }) => {
    setGenerating(true)
    try {
      await api("/database", {
        method: "POST",
        body: JSON.stringify(data),
      })
      toast.success("Database generated")
      onSuccess?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate database")
    } finally {
      setGenerating(false)
    }
  }

  return { generate, generating }
}

export function useDatabaseQuery() {
  const [querying, setQuerying] = useState(false)

  const query = async ({ id, dql }: { id: string, dql: string }) => {
    setQuerying(true)
    try {
      return await api(`/database/query/${id}`, {
        method: "POST",
        body: JSON.stringify({ dql }),
      }) as DatabaseQueryData
    } finally {
      setQuerying(false)
    }
  }

  return { query, querying }
}

export function useDatabaseUpdate(onSuccess?: () => void) {
  const [updating, setUpdating] = useState(false)

  const update = async ({ id, name, description }: { id: string, name?: string, description?: string }) => {
    setUpdating(true)
    try {
      const result = await api(`/database/${id}`, { method: "PATCH", body: JSON.stringify({ name, description }) }) as Database
      onSuccess?.()
      if (result) {
        toast.success("Database updated.")
      } else {
        toast.error("Database update failed - see console for details")
      }
    } catch {
      toast.error("Database update failed - see console for details")
    } finally {
      setUpdating(false)
    }
  }

  return { update, updating }
}

export function useDatabaseDelete(onSuccess?: () => void) {
  const [deleting, setDeleting] = useState(false)

  const deleteDatabase = async ({ id }: { id: string }) => {
    setDeleting(true)
    try {
      api(`/database/${id}`, { method: "DELETE" })
      onSuccess?.()
      toast.success("Database deleted.")
    } catch {
      toast.error("Database delete failed - see console for details")
    } finally {
      setDeleting(false)
    }
  }

  return { deleteDatabase, deleting }
}
