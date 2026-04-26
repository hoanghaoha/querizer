import { api } from "@/lib/api";
import { Challenge, ChallengeLevel } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

export function useChallengeGenerate() {
  const [generating, setGenerating] = useState(false)

  const generate = async (data: { database_id: string, level: ChallengeLevel, topics: string, context: string }) => {
    setGenerating(true)
    try {
      const challenge = await api(`/challenge`, { method: "POST", body: JSON.stringify(data) }) as Challenge
      toast.success("Challenge generated")
      return challenge
    } catch {
      toast.error("Challenge generate failed - see console for details")
    } finally {
      setGenerating(false)
    }
  }

  return { generate, generating }

}
