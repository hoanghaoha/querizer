import { IconShare, IconUsers, IconThumbUp, IconFilter } from "@tabler/icons-react"

const COMING_SOON_FEATURES = [
  { icon: IconShare, label: "Share your own challenges with the community" },
  { icon: IconUsers, label: "Browse and solve challenges from other users" },
  { icon: IconThumbUp, label: "Upvote and bookmark your favorites" },
  { icon: IconFilter, label: "Filter by level, topic, and database" },
]

const Page = () => {
  return (
    <div className="flex flex-col gap-8 pt-10 mx-auto w-[60%]">
      <p className="font-bold text-xl">Community Challenges</p>

      <div className="rounded-lg border border-border p-10 flex flex-col items-center gap-6 text-center">
        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
          <IconShare className="size-7 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">Coming soon</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Community challenges are on the way. You&apos;ll be able to share, discover, and compete on challenges built by other users.
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
