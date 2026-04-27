import { IconSwords, IconTrophy, IconMedal, IconMedal2 } from "@tabler/icons-react"

const COMING_SOON_FEATURES = [
  { icon: IconTrophy, label: "Global rankings by score" },
  { icon: IconMedal, label: "Tier-based divisions" },
  { icon: IconMedal2, label: "Weekly & monthly snapshots" },
  { icon: IconSwords, label: "Head-to-head solve streaks" },
]

const Page = () => {
  return (
    <div className="flex flex-col gap-8 pt-10 mx-auto w-[60%]">
      <p className="font-bold text-xl">Leaderboard</p>

      <div className="rounded-lg border border-border p-10 flex flex-col items-center gap-6 text-center">
        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
          <IconSwords className="size-7 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">Coming soon</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            We&apos;re building the leaderboard. Keep solving challenges — your score is already being tracked.
          </p>
        </div>

        <div className="w-full max-w-xs flex flex-col gap-2 text-left">
          {COMING_SOON_FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
