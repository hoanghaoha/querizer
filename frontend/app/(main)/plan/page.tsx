"use client"

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCheckout, usePortal } from "@/hooks/polar"
import { useUser } from "@/hooks/user"
import { PLANS } from "@/lib/const"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"

const Page = () => {
  const { user, loading: userLoading } = useUser()
  const { openPortal, loading: portalLoading } = usePortal()
  const { checkout, loading: checkoutLoading } = useCheckout()
  const loading = userLoading || portalLoading || checkoutLoading
  return (
    <div className="flex flex-col gap-10 items-center justify-center py-10 w-[80%] mx-auto">
      <div className="text-muted-foreground">Start free, cancel any time.</div>
      <div className="flex gap-10 w-full">
        {PLANS.map((plan) => {
          const activePlan = user?.plan === plan.title
          const action = user?.plan === "Free"
            ? async () => { await checkout(plan.title) }
            : async () => { await openPortal() }
          return (
            (
              <Card key={plan.title} className="w-full rounded-2xl border">
                <CardHeader>
                  <CardTitle className="text-lg flex gap-2">
                    <plan.icon />
                    {plan.title}
                  </CardTitle>
                  <CardDescription>{plan.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 flex flex-col gap-2">
                  <p className="text-4xl font-semibold">$ {plan.price}<span className="text-sm text-muted-foreground">/ month</span></p>
                  <Button size="lg" disabled={activePlan} onClick={action}>
                    {loading ? <IconLoader2 className="animate-spin" /> : null}
                    {activePlan ? "Active Plan" : `Get ${plan.title}`}
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
            )
          )
        })}
      </div>
    </div>
  )
}

export default Page
