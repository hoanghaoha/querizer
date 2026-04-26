"use client"

import { api } from "@/lib/api"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/types"
import { useCallback, useEffect, useState } from "react"
import type { User as AuthUser } from '@supabase/supabase-js'
import { toast } from "sonner"

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
    } catch {
      toast.error("Error when get user - see console for details")
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
    } catch {
      toast.error("Failed to update user — see console for details")
    } finally {
      setUpdating(false)
    }
  }

  return { update, updating }
}
