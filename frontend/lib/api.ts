import { supabase } from "./supabase"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function api(path: string, options: RequestInit = {}) {
  const token = await getToken()

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    await supabase.auth.signOut()
    window.location.href = "/signin"
    throw new Error("Session expired")
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const detail = body?.detail
    const message = Array.isArray(detail)
      ? detail.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
      : detail ?? `Request failed with status ${res.status}`
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}
