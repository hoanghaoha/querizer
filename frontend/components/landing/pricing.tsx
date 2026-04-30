import { PLANS } from "@/lib/const"
import { IconArrowRight, IconCheck } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

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
            <Card key={plan.title} className="w-full rounded-2xl border">
              <CardHeader>
                <CardTitle className="text-lg flex gap-2">
                  <plan.icon />
                  {plan.title}
                </CardTitle>
                <CardDescription>{plan.tagline}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 flex flex-col gap-2">
                <p className="text-4xl font-semibold">
                  $ {plan.price}<span className="text-sm text-muted-foreground">/ month</span>
                </p>
                <Button size="lg" asChild>
                  <Link href="/signin">
                    {plan.price === 0 ? "Get started free" : `Get ${plan.title}`}
                    <IconArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-col gap-4 items-start p-4">
                {plan.features.map(feature => (
                  <div key={feature.label} className="flex gap-2 items-center">
                    <IconCheck size={10} />
                    <p>{feature.label} - {feature.value}</p>
                  </div>
                ))}
              </CardFooter>
            </Card>
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
