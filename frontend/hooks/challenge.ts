"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Challenge, ChallengeLevel, DatabaseQueryData } from "@/lib/types"

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

export function useChallengeSubmit() {
  const [submitting, setSubmitting] = useState(false)

  const submit = async ({ id, database_id, dql }: { id: string; database_id: string; dql: string }) => {
    setSubmitting(true)
    try {
      const data = await api(`/challenge/submit/${id}`, {
        method: "POST",
        body: JSON.stringify({ database_id, dql }),
      }) as { solved: boolean, result: DatabaseQueryData }
      data.solved ? toast.success("Correct! Well done.") : toast.error("Not quite right. Try again.")
      return data
    } finally {
      setSubmitting(false)
    }
  }

  return { submit, submitting }
}

export function useChallengeHint() {
  const [hinting, setHinting] = useState(false)

  const hint = async ({ id, database_id, dql }: { id: string; database_id: string; dql: string }) => {
    setHinting(true)
    try {
      const data = await api(`/challenge/hint/${id}`, {
        method: "POST",
        body: JSON.stringify({ database_id: database_id, dql }),
      }) as string
      return data
    } catch {
      toast.error("Failed to get hint - see console for details")
    } finally {
      setHinting(false)
    }
  }

  return { hint, hinting }
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

