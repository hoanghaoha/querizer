import { IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"
import { Button } from "../ui/button"

const Hero = () => {
  return (
    <section className="flex flex-col gap-10 pt-24 md:pt-32 pb-20 md:pb-24 items-center text-center max-w-3xl mx-auto px-6">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Learn SQL.<br />
          <span className="text-emerald-400">Actually enjoy it.</span>
        </h1>
        {/* <h1> */}
        {/*   Repositing: SQL practice playground with unque customized challenges */}
        {/* </h1> */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
          Generate a database. Get challenges built around it. Practice on problems no one's posted answers to.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button size="lg" asChild>
          <Link href="/signin">
            Start for free
            <IconArrowRight />
          </Link>
        </Button>
        <Button size="lg" variant="ghost" asChild>
          <Link href="/#features">See how it works</Link>
        </Button>
      </div>
    </section>
  )
}

export default Hero
