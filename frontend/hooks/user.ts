"use client"

import { api } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import { Feedback, User } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"
import type { User as AuthUser } from '@supabase/supabase-js'
import { toast } from "sonner"

function errorMessage(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setAuthUser(user)
    }
    load()
  }, [])

  return authUser
}

export function useUser() {
  const authUser = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!authUser) return
    setLoading(true)

    try {
      const user: User = await api("/user", {
        method: "POST",
        body: JSON.stringify({
          email: authUser.email,
          name: authUser.user_metadata.name,
          avatar_url: authUser.user_metadata.avatar_url
        })
      })
      setUser(user)
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load user"))
    } finally {
      setLoading(false)
    }
  }, [authUser])

  useEffect(() => { load() }, [load])

  return { user, loading, refresh: load }
}

export function useUserUpdate(onSuccess?: () => void) {
  const [updating, setUpdating] = useState(false)

  const update = async (data: {
    name?: string
    expertise?: string
    sql_level?: string
    plan?: string
  }) => {
    setUpdating(true)
    try {
      await api("/user/update", {
        method: "POST",
        body: JSON.stringify(data),
      })
      toast.success("User updated")
      onSuccess?.()
    } catch (e) {
      toast.error(errorMessage(e, "Failed to update user"))
    } finally {
      setUpdating(false)
    }
  }

  return { update, updating }
}

export function useFeedback(onSuccess?: () => void) {
  const [sending, setSending] = useState(false)

  const feedback = async ({ type, message }: Feedback) => {
    setSending(true)
    try {
      await api("/feedback", {
        method: "POST",
        body: JSON.stringify({ type, message })
      })
      toast.success("Feedback sent")
      onSuccess?.()
    } catch (e) {
      toast.error(errorMessage(e, "Failed to send feedback"))
    } finally {
      setSending(false)
    }
  }

  return { feedback, sending }
}
