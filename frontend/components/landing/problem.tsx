const Problem = () => {
  return (
    <section className="py-24 border-y border-border bg-muted/20">
      <div className="max-w-2xl mx-auto px-6 flex flex-col gap-8 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">The shift</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Joy first. Skills follow.</h2>
        <div className="flex flex-col gap-4 text-lg text-muted-foreground leading-relaxed">
          <p>
            Most SQL learning is built around the result — a job, a certificate, a badge.
            So the experience becomes something to get through. That's why it feels like a grind.
          </p>
          <p>
            When you actually enjoy the process, you come back. When you come back, you improve.
            Skills and results are lag indicators. The lead indicator is whether you want
            to open the app again tomorrow.
          </p>
          <p className="text-foreground font-medium">
            Querizer makes that possible by generating practice that's actually yours —
            fresh databases, fresh challenges, every session.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Problem
