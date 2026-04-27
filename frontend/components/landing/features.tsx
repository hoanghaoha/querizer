import { IconBulb, IconDatabase, IconSparkles, IconStairs } from "@tabler/icons-react"
import type { Icon } from "@tabler/icons-react"

const FEATURES: { icon: Icon; title: string; description: string }[] = [
  {
    icon: IconDatabase,
    title: "Your database, generated",
    description:
      "Pick an industry. Get a realistic schema with seeded data. The tables, the relationships, the rows — built for you.",
  },
  {
    icon: IconSparkles,
    title: "Challenges with no answer key online",
    description:
      "Each challenge is generated for your specific database. Stack Overflow can't help — the problem doesn't exist anywhere else.",
  },
  {
    icon: IconBulb,
    title: "Hints generated from your code, not pre-written",
    description:
      "Hints aren't pre-written. Querizer reads your query and adds comments at the lines that need attention — for your specific gap, not a generic nudge.",
  },
  {
    icon: IconStairs,
    title: "Practice at any depth",
    description:
      "Beginner to Hell, all on the same database. The context never resets, so you stay in flow as the difficulty climbs.",
  },
]

const Features = () => {
  return (
    <section id="features" className="py-24 max-w-5xl mx-auto px-6">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything built around the experience</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-4 p-8 rounded-2xl border border-border bg-card">
              <div className="size-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <Icon className="size-5 text-emerald-400" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
