import { PLANS } from "@/lib/const"
import { IconArrowRight, IconCheck, IconInfinity } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "../ui/button"

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 border-t border-border bg-muted/20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start free. Upgrade when ready.</h2>
          <p className="text-muted-foreground">No credit card required to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan.title}
              className={`relative flex flex-col rounded-2xl border p-7 gap-7 transition-colors
                ${plan.highlight ? `${plan.accentBg} ${plan.accentBorder}` : "border-border bg-card"}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-background">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-1">
                <span className={`text-base font-semibold ${plan.accent}`}>{plan.title}</span>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                {plan.price === 0 ? (
                  <span className="text-4xl font-bold tracking-tight">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold tracking-tight tabular-nums">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </>
                )}
              </div>

              <ul className="flex flex-col gap-3 border-t border-border pt-6">
                {plan.features.map(f => (
                  <li key={f.label} className="flex items-center gap-3 text-sm">
                    <IconCheck className={`size-4 shrink-0 ${plan.accent}`} />
                    <span>{f.label}</span>
                    <span className={`ml-auto font-semibold tabular-nums ${f.value === "Unlimited" ? plan.accent : "text-muted-foreground"}`}>
                      {f.value === "Unlimited" ? <IconInfinity className="size-4" /> : f.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-2">
                <Button
                  className={`w-full ${plan.title === "Max"
                    ? "bg-violet-500 hover:bg-violet-600 text-white"
                    : plan.title === "Pro"
                      ? "bg-emerald-400 hover:bg-emerald-500 text-background"
                      : ""}`}
                  variant={plan.title === "Free" ? "outline" : "default"}
                  asChild
                >
                  <Link href="/signin">
                    {plan.price === 0 ? "Get started free" : `Get ${plan.title}`}
                    <IconArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          All plans include access to community challenges and the leaderboard.
        </p>
      </div>
    </section>
  )
}

export default Pricing
