import { supabase } from "./supabase"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

export async function api(path: string, options: RequestInit = {}) {
  const token = await getToken()
  const url = `${BACKEND_URL}${path}`

  console.log(`[api] ${options.method ?? "GET"} ${url}`, {
    body: options.body ? JSON.parse(options.body as string) : undefined,
  })

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
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

    console.warn(`[api] ${res.status} ${url}`, error)
    throw new Error(message)
  }

  if (res.status === 204) return null

  const data = await res.json()
  console.log(`[api] ${res.status} ${url}`, { data })
  return data
}
