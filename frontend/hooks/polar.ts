import { api } from "@/lib/api"
import { useState } from "react"
import { toast } from "sonner"

function errorMessage(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback
}

export function usePortal() {
  const [loading, setLoading] = useState(false)

  const openPortal = async () => {
    setLoading(true)
    try {
      const { url } = await api("/polar/portal", { method: "POST" }) as { url: string }
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (e) {
      toast.error(errorMessage(e, "Failed to open billing portal"))
    } finally {
      setLoading(false)
    }
  }

  return { openPortal, loading }
}

export function useCheckout() {
  const [loading, setLoading] = useState(false)

  const checkout = async (plan: string) => {
    setLoading(true)
    try {
      const { url } = await api("/polar/checkout", {
        method: "POST",
        body: JSON.stringify({
          plan,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/plan`,
        }),
      }) as { url: string }
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (e) {
      toast.error(errorMessage(e, "Failed to start checkout"))
    } finally {
      setLoading(false)
    }
  }

  return { checkout, loading }
}
