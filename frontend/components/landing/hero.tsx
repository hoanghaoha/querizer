import { IconArrowRight } from "@tabler/icons-react"
import { Button } from "../ui/button"

const Hero = () => {
  return (
    <div className="flex flex-col gap-12 px-40 py-20 items-center">
      <div className="flex flex-col gap-4 text-center">
        <p className="text-6xl font-semibold">Make <span className="text-emerald-300">SQL</span> feel <span className="text-green-300">easy</span> and <span className="text-green-300">enjoyable</span></p>
        <p className="text-muted-foreground">Unlimited AI-generated challenges. Practice at your own pace.</p>
      </div>
      <div className="flex items-center gap-4">
        <Button>
          Get started for free
          <IconArrowRight />
        </Button>
        <Button variant={"secondary"}>
          See how it works
        </Button>
      </div>
    </div>
  )
}

export default Hero
