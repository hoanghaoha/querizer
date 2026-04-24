export type UserPlan = "Free" | "Pro"

export type User = {
  id: string
  email: string
  name?: string
  plan: UserPlan
  avatar_url?: string
  expertise?: string
  sql_level: string
}
