import Footer from "@/components/landing/footer"
import NavBar from "@/components/landing/nav-bar"

const Page = () => {
  return (
    <div className="flex flex-col">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: April 27, 2026</p>
        </div>

        <section className="rounded-lg border border-border bg-muted/20 p-5 flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">TL;DR</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Use Querizer to learn SQL. Don't abuse it.</li>
            <li>The service is provided as-is — best effort, no uptime guarantees.</li>
            <li>Keep your account credentials safe.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">The service</h2>
          <p className="text-muted-foreground leading-relaxed">
            Querizer is a SQL learning platform that generates practice databases, challenges, and hints.
            The service is provided as-is, with no uptime or accuracy guarantees.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Your account</h2>
          <p className="text-muted-foreground leading-relaxed">
            You're responsible for your account and any activity on it. Don't share credentials.
            If you suspect unauthorized access, let us know.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Acceptable use</h2>
          <p className="text-muted-foreground leading-relaxed">Don't:</p>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li>Scrape, abuse, or overload the service.</li>
            <li>Try to extract prompts or model outputs at scale.</li>
            <li>Use Querizer to generate content unrelated to learning SQL.</li>
            <li>Reverse-engineer or attack the platform.</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Violations may result in suspension or termination of your account.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Content</h2>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            <li><span className="text-foreground font-medium">Your queries</span>: you own them. We process them to provide hints and grading.</li>
            <li><span className="text-foreground font-medium">Generated databases and challenges</span>: you can use them freely for learning.</li>
            <li><span className="text-foreground font-medium">The platform</span> (code, prompts, UI): we own it.</li>
          </ul>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Plans and billing</h2>
          <p className="text-muted-foreground leading-relaxed">
            The Free plan is free. Paid plans (when available) are billed monthly via Stripe.
            You can cancel anytime — access continues until the end of the current billing period.
            No refunds for partial months.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Service changes</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may change the service, pricing, or features. Material changes will be communicated
            in-app or by email.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can stop using Querizer at any time. We may terminate accounts that violate these terms.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Limitation of liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            Querizer is provided as-is, without warranty of any kind. We're not liable for any
            indirect, incidental, or consequential damages arising from your use of the service.
          </p>
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
