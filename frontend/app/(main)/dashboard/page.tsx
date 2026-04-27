"use client"

import { useDashboard } from "@/hooks/dashboard"
import { CHALLENGE_LEVEL, TIER_CONFIG } from "@/lib/const"
import { Dashboard } from "@/lib/types"
import { IconFlame } from "@tabler/icons-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts"


function TierCard({ dashboard }: { dashboard: Dashboard }) {
  const { tier, tier_min, tier_max, total_score } = dashboard
  const { icon: TierIcon, color, barColor } = TIER_CONFIG[tier]
  const progress = tier_max
    ? Math.min(((total_score - tier_min) / (tier_max - tier_min)) * 100, 100)
    : 100

  return (
    <div className="rounded-lg border border-border p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TierIcon className={`size-6 ${color}`} />
          <span className={`text-2xl font-bold ${color}`}>{tier}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {total_score.toLocaleString()}{tier_max ? ` / ${tier_max.toLocaleString()} XP` : " XP"}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={`h-2 rounded-full transition-all ${barColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {tier_max && (
        <p className="text-xs text-muted-foreground">
          {(tier_max - total_score).toLocaleString()} XP to next tier
        </p>
      )}
    </div>
  )
}

function KpiStrip({ dashboard }: { dashboard: Dashboard }) {
  const { total_score, solved, current_streak, longest_streak } = dashboard
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-border p-4 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Score</p>
        <p className="text-2xl font-bold">{total_score.toLocaleString()}</p>
      </div>
      <div className="rounded-lg border border-border p-4 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Solved</p>
        <p className="text-2xl font-bold">{solved}</p>
      </div>
      <div className="rounded-lg border border-border p-4 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Streak</p>
        <div className="flex items-center gap-2">
          <IconFlame className="text-orange-400 size-5" />
          <p className="text-2xl font-bold">{current_streak}d</p>
          <p className="text-sm text-muted-foreground">best {longest_streak}d</p>
        </div>
      </div>
    </div>
  )
}

function ByLevel({ dashboard }: { dashboard: Dashboard }) {
  const max = Math.max(...dashboard.by_level.map(l => l.count), 1)
  return (
    <div className="rounded-lg border border-border p-5 flex flex-col gap-4">
      <p className="font-semibold">By Level</p>
      <div className="flex flex-col gap-3">
        {dashboard.by_level.map(({ level, count }) => {
          const barColor = CHALLENGE_LEVEL.find(l => l.title === level)?.barColor ?? "bg-primary"
          return (
            <div key={level} className="flex items-center gap-3">
              <span className="w-20 text-sm text-muted-foreground shrink-0">{level}</span>
              <div className="flex-1 h-2 rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full transition-all ${barColor}`}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-6 text-sm text-right tabular-nums">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IndependenceCard({ dashboard }: { dashboard: Dashboard }) {
  const { independence, solved, attempted, solve_rate } = dashboard
  const total = independence.clean + independence.hinted + independence.peeked || 1
  const pct = (n: number) => Math.round((n / total) * 100)

  return (
    <div className="rounded-lg border border-border p-5 flex flex-col gap-4">
      <p className="font-semibold">Quality</p>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Clean solves</span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-sm font-medium">{pct(independence.clean)}%</span>
            <span className="text-xs text-muted-foreground">({independence.clean})</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Used hints</span>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm font-medium">{pct(independence.hinted)}%</span>
            <span className="text-xs text-muted-foreground">({independence.hinted})</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Viewed solution</span>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm font-medium">{pct(independence.peeked)}%</span>
            <span className="text-xs text-muted-foreground">({independence.peeked})</span>
          </div>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Solve rate</span>
          <span className="text-sm font-medium">
            {solve_rate}%{" "}
            <span className="text-muted-foreground text-xs">({solved}/{attempted})</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function ActivityChart({ activity }: { activity: ActivityDay[] }) {
  const data = activity.map(d => ({
    date: d.date,
    count: d.count,
    label: new Date(d.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
  }))

  return (
    <div className="rounded-lg border border-border p-5 flex flex-col gap-4">
      <p className="font-semibold">Activity</p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={13}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              fontSize: 12,
            }}
            formatter={(value: number) => [value, "Solved"]}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--color-primary)"
            strokeWidth={2}
            fill="url(#activityGradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const Page = () => {
  const { dashboard, loading } = useDashboard()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Loading...
      </div>
    )
  }

  if (!dashboard) return null

  return (
    <div className="flex flex-col gap-6 pt-10 pb-10 mx-auto w-[60%]">
      <p className="font-bold text-xl">Dashboard</p>
      <TierCard dashboard={dashboard} />
      <KpiStrip dashboard={dashboard} />
      <div className="grid grid-cols-2 gap-4">
        <ByLevel dashboard={dashboard} />
        <IndependenceCard dashboard={dashboard} />
      </div>
      <ActivityChart activity={dashboard.activity} />
    </div>
  )
}

export default Page
