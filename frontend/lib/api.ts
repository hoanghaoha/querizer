import { supabase } from "./supabase"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function api(
  path: string,
  options: RequestInit = {}
) {
  const token = await getToken()

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })

  if (!res.ok) {
    const error = await res.json().catch(() => null)
    const detail = error?.detail
    const message =
      (Array.isArray(detail)
        ? detail.map((e: { msg?: string }) => e.msg ?? JSON.stringify(e)).join(", ")
        : detail) ??
      error?.message ??
      error?.error ??
      `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return res.json()
}
