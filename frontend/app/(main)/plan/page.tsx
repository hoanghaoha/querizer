"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/user"
import { PLANS } from "@/lib/const"
import type { UserPlan } from "@/lib/types"
import { IconCheck, IconInfinity, IconSparkles } from "@tabler/icons-react"

const PLAN_ORDER: UserPlan[] = ["Free", "Pro", "Max"]

const Page = () => {
  const { user } = useUser()
  const currentPlan = user?.plan ?? "Free"

  return (
    <div className="flex flex-col gap-12 py-14 mx-auto max-w-5xl px-6">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">
          Start free. Upgrade when you need more practice. Cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const isCurrent = plan.title === currentPlan
          const isUpgrade =
            PLAN_ORDER.indexOf(plan.title as UserPlan) > PLAN_ORDER.indexOf(currentPlan)

          return (
            <div
              key={plan.title}
              className={`
                relative flex flex-col rounded-2xl border p-7 gap-7 transition-colors
                ${isCurrent ? "border-foreground" : `border-border ${plan.accentBorder}`}
                ${plan.highlight ? plan.accentBg : "bg-card"}
              `}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                  Most Popular
                </div>
              )}

              {/* Header: Plan + tagline */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className={`text-base font-semibold ${plan.accent}`}>
                    {plan.title}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border rounded-full px-2 py-0.5">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold tracking-tight">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight tabular-nums">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 border-t border-border pt-6">
                {plan.features.map(f => (
                  <li key={f.label} className="flex items-center gap-3 text-sm">
                    <IconCheck className={`size-4 shrink-0 ${plan.accent}`} />
                    <span className="text-foreground">{f.label}</span>
                    <span className={`ml-auto font-semibold tabular-nums ${f.value === "Unlimited" ? plan.accent : "text-muted-foreground"}`}>
                      {f.value === "Unlimited"
                        ? <IconInfinity className="size-4" />
                        : f.value}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto pt-2">
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    <IconCheck className="size-3.5" />
                    Active Plan
                  </Button>
                ) : isUpgrade ? (
                  <Button
                    className={`w-full ${plan.title === "Max"
                      ? "bg-violet-500 hover:bg-violet-600 text-white"
                      : plan.title === "Pro"
                        ? "bg-emerald-400 hover:bg-emerald-500 text-background"
                        : ""}`}
                  >
                    <IconSparkles className="size-3.5" />
                    Upgrade to {plan.title}
                  </Button>
                ) : (
                  <Button variant="ghost" className="w-full text-muted-foreground">
                    Downgrade to {plan.title}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        All plans include access to community challenges and the leaderboard.
      </p>
    </div>
  )
}

export default Page
