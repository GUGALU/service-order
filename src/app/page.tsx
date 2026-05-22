export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_38%),linear-gradient(160deg,_#0f172a,_#111827_55%,_#030712)] text-white">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-6 py-16 lg:px-10">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur">
            Order management system
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Clients, services, orders, and scheduled messaging in one API-first
            workspace.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300">
            The core flows are implemented behind protected routes: master data
            CRUD, order lifecycle rules, message templates, future schedules,
            and authentication.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/login"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              Sign in
            </a>
            <a
              href="/dashboard"
              className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
            >
              Open dashboard
            </a>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            [
              "Master data",
              "Clients and services with search, pagination, and delete rules.",
            ],
            [
              "Orders",
              "Create orders, enforce status transitions, and persist history.",
            ],
            [
              "Scheduling",
              "Templates, future schedules, processing, and follow-up triggers.",
            ],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 bg-white/6 p-6 backdrop-blur"
            >
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
