"use client"

import { useCallback, useEffect, useState } from "react"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Challenge, ChallengeLevel, DatabaseQueryData } from "@/lib/types"

function errorMessage(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback
}

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
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load challenges"))
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
    } catch (e) {
      toast.error(errorMessage(e, "Failed to load challenge"))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  return { challenge, loading, refresh: load }
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
    } catch (e) {
      toast.error(errorMessage(e, "Failed to generate challenge"))
    } finally {
      setGenerating(false)
    }
  }

  return { generate, generating }
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
      toast.success("Challenge updated")
      onSuccess?.()
      return result
    } catch (e) {
      toast.error(errorMessage(e, "Failed to update challenge"))
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
      toast.success("Challenge deleted")
      onSuccess?.()
    } catch (e) {
      toast.error(errorMessage(e, "Failed to delete challenge"))
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
    } catch (e) {
      toast.error(errorMessage(e, "Failed to submit"))
      throw e
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
      }) as { dql: string }
      return data.dql
    } catch (e) {
      toast.error(errorMessage(e, "Failed to get hint"))
    } finally {
      setHinting(false)
    }
  }

  return { hint, hinting }
}

export function useSolutionViewed() {
  const trackSolution = async (id: string) => {
    try {
      await api(`/challenge/solution/${id}`, { method: "POST" })
    } catch {
      // non-critical, fail silently
    }
  }
  return { trackSolution }
}
