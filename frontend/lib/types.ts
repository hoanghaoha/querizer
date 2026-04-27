export type UserPlan = "Free" | "Pro" | "Max"

export type User = {
  id: string
  email: string
  name?: string
  plan: UserPlan
  avatar_url?: string
  expertise?: string
  sql_level: string
}

export type DatabaseIndustry =
  | "Technology"
  | "Finance"
  | "Retail"
  | "Healthcare"
  | "Manufacturing"
  | "Logistics"
  | "Government"
  | "Education"
  | "F&B"
  | "Travel"
  | "Real Estate"
  | "Media"

export type DatabaseSize =
  | "Small"
  | "Medium"
  | "Large"

export type ColumnGenerator =
  | { method: "faker"; faker_key: string; faker_args?: Record<string, unknown> }
  | { method: "enum"; values: string[]; weights?: number[] }
  | { method: "numpy"; distribution: "lognormal" | "normal" | "uniform" | "exponential"; mean?: number; sigma?: number; std?: number; min?: number; max?: number; scale?: number; round?: number }
  | { method: "foreign_key"; references: string; distribution?: "uniform" | "power_law" }
  | { method: "random_int"; min?: number; max?: number }
  | { method: "random_float"; min?: number; max?: number }

export type DatabaseColumn = {
  name: string
  type: "INTEGER" | "TEXT" | "REAL"
  primary_key?: boolean
  nullable?: boolean
  unique?: boolean
  null_rate?: number
  generator?: ColumnGenerator
}

export type DatabaseTable = {
  name: string
  row_count: number
  columns: DatabaseColumn[]
}

export type DatabaseSchema = {
  tables: DatabaseTable[]
}

export type Database = {
  id: string
  user_id: string
  name: string
  industry: DatabaseIndustry
  size: DatabaseSize
  description?: string
  row_count: number
  db_schema: DatabaseSchema
  db_path: string
  created_at: string
}

export type DatabaseQueryData = {
  rows: unknown[][]
  columns: string[]
}

export type ChallengeLevel = "Beginner" | "Easy" | "Medium" | "Hard" | "Hell"

export type Challenge = {
  id: string
  database_id: string
  user_id: string
  name: string
  description: string
  level: ChallengeLevel
  topics: string[]
  solution: string
  public: boolean
}

export type Tier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Challenger"

export type LevelCount = { level: string; count: number }

export type IndependenceRate = { clean: number; hinted: number; peeked: number }

export type ActivityDay = { date: string; count: number }

export type Dashboard = {
  total_score: number
  tier: Tier
  tier_min: number
  tier_max: number | null
  solved: number
  attempted: number
  solve_rate: number
  current_streak: number
  longest_streak: number
  by_level: LevelCount[]
  independence: IndependenceRate
  activity: ActivityDay[]
}

export type FeedbackType = "general" | "features" | "bug"

export type Feedback = {
  type: FeedbackType
  message: string
}
