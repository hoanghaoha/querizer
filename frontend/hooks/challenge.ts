"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Challenge, ChallengeLevel } from "@/lib/types"

export function useChallenges(databaseId?: string) {
  const [loading, setLoading] = useState(false)
  const [challenges, setChallenges] = useState<Challenge[] | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const url = databaseId
        ? `/challenge/challenges?database_id=${databaseId}`
        : "/challenge/challenges"
      const data = await api(url, { method: "GET" }) as Challenge[]
      setChallenges(data)
    } catch {
      toast.error("Failed to get challenges - see console for details")
    } finally {
      setLoading(false)
    }
  }, [databaseId])

  useEffect(() => { load() }, [load])

  return { challenges, loading, refresh: load }
}

export function useChallenge(id: string) {
  const [loading, setLoading] = useState(false)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api(`/challenge/${id}`, { method: "GET" }) as Challenge
      setChallenge(data)
    } catch {
      toast.error("Failed to get challenge - see console for details")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  return { challenge, loading, refresh: load }
}

export function useChallengeUpdate(onSuccess?: () => void) {
  const [updating, setUpdating] = useState(false)

  const update = async ({ id, public: isPublic }: { id: string; public: boolean }) => {
    setUpdating(true)
    try {
      const result = await api(`/challenge/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ public: isPublic }),
      }) as Challenge
      onSuccess?.()
      return result
    } catch {
      toast.error("Failed to update challenge - see console for details")
    } finally {
      setUpdating(false)
    }
  }

  return { update, updating }
}

export function useChallengeDelete(onSuccess?: () => void) {
  const [deleting, setDeleting] = useState(false)

  const deleteChallenge = async ({ id }: { id: string }) => {
    setDeleting(true)
    try {
      await api(`/challenge/${id}`, { method: "DELETE" })
      onSuccess?.()
      toast.success("Challenge deleted.")
    } catch {
      toast.error("Failed to delete challenge - see console for details")
    } finally {
      setDeleting(false)
    }
  }

  return { deleteChallenge, deleting }
}

export function useChallengeGenerate(onSuccess?: () => void) {
  const [generating, setGenerating] = useState(false)

  const generate = async (data: {
    database_id: string
    level: ChallengeLevel
    topics: string | null
    context: string | null
  }) => {
    setGenerating(true)
    try {
      const challenge = await api("/challenge", {
        method: "POST",
        body: JSON.stringify(data),
      }) as Challenge
      toast.success("Challenge generated")
      onSuccess?.()
      return challenge
    } catch {
      toast.error("Failed to generate challenge — see console for details")
    } finally {
      setGenerating(false)
    }
  }

  return { generate, generating }
}
