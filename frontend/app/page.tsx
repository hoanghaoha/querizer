import CTA from "@/components/landing/cta"
import Features from "@/components/landing/features"
import Footer from "@/components/landing/footer"
import Hero from "@/components/landing/hero"
import NavBar from "@/components/landing/nav-bar"
import Pricing from "@/components/landing/pricing"
import Problem from "@/components/landing/problem"

export default function Page() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <Hero />
      <Problem />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
