import { IconLoader2 } from "@tabler/icons-react"

export default function PageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-[60vh] text-muted-foreground">
      <IconLoader2 className="size-6 animate-spin" />
      <p className="text-sm">{text}</p>
    </div>
  )
}
