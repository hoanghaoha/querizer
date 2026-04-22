import Hero from "@/components/landing/hero";
import NavBar from "@/components/landing/nav-bar";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-20">
      <NavBar />
      <Hero />
    </div>
  )
}
