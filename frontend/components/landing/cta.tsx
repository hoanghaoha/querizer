import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "../ui/button"

const CTA = () => {
  return (
    <section className="py-32 border-t border-border">
      <div className="max-w-2xl mx-auto px-6 flex flex-col gap-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Ready to actually enjoy SQL?
        </h2>
        <p className="text-lg text-muted-foreground">
          Start for free. No credit card. No rigid path. Just you, a fresh database, and a challenge waiting.
        </p>
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link href="/signin">
              Start for free
              <IconArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default CTA
