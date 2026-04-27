import Footer from "@/components/landing/footer"
import NavBar from "@/components/landing/nav-bar"

const Page = () => {
  return (
    <div className="flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: April 27, 2026</p>
        </div>

        <section className="rounded-lg border border-border bg-muted/20 p-5 flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">TL;DR</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>We collect basic profile info from your OAuth provider so you can sign in.</li>
            <li>We store your generated databases, challenges, and submission history.</li>
            <li>Your SQL queries are sent to Anthropic (Claude) to generate hints — don't paste production data.</li>
            <li>We don't sell your data and don't run ad-network trackers.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">What we collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you sign in via OAuth (Google, GitHub, etc.) we receive your email, display name, and avatar URL.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When you use Querizer, we store: databases you generate, challenges you generate,
            your SQL submissions and hint requests, and basic usage metrics (counts per month for plan enforcement).
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">How we use it</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Provide the service — your account, your data.</li>
            <li>Enforce plan limits (counts of generations per billing cycle).</li>
            <li>Improve the product, in aggregated and anonymized form.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Third parties</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li><span className="text-foreground font-medium">Supabase</span> — database, authentication, file storage.</li>
            <li><span className="text-foreground font-medium">Anthropic (Claude)</span> — generates databases, challenges, and hints based on your inputs (including the SQL you write).</li>
            <li><span className="text-foreground font-medium">Stripe</span> (future) — payment processing if you upgrade.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Your rights</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Request a copy of your data — contact us.</li>
            <li>Delete your account — contact us or use the in-app feedback form.</li>
            <li>Stop using the service at any time.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">What we don't do</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Sell your data.</li>
            <li>Run third-party tracking pixels or ad-network beacons.</li>
            <li>Send unsolicited marketing emails.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Use the in-app feedback form, or reach out at{" "}
            <a href="https://hhhao.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">hhhao.dev</a>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Page
