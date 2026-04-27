"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Dashboard } from "@/lib/types"

function errorMessage(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback
}

export function useDashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api("/dashboard", { method: "GET" }) as Dashboard
        setDashboard(data)
      } catch (e) {
        toast.error(errorMessage(e, "Failed to load dashboard"))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { dashboard, loading }
}
