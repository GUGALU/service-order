import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { extendedPrisma } from "@/infra/database/prisma/client";
import { resolveSessionFromToken } from "@/core/auth";
import { SESSION_COOKIE_NAME } from "@/infra/auth/session";

export default async function DashboardPage() {
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="rounded-full border border-white/15 px-4 py-2 transition hover:bg-white/8">
                Log out
              </button>
            </form>
            <Link href="/" className="rounded-full border border-white/15 px-4 py-2 transition hover:bg-white/8">
              Home
            </Link>
      extendedPrisma.order.count(),
      extendedPrisma.schedule.count(),
      extendedPrisma.messageTemplate.count(),
    ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Protected dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Welcome, {session.user.name}
          </h1>
          <p className="mt-2 text-slate-300">
            This workspace exposes the implemented business flows through API
            routes and a protected landing surface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-white/15 px-4 py-2 transition hover:bg-white/8"
              >
                Log out
              </button>
            </form>
            <a
              href="/"
              className="rounded-full border border-white/15 px-4 py-2 transition hover:bg-white/8"
            >
              Home
            </a>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Clients", clientCount],
            ["Services", serviceCount],
            ["Orders", orderCount],
            ["Schedules", scheduleCount],
            ["Templates", templateCount],
          ].map(([label, value]) => (
            <article
              key={label as string}
              className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur"
            >
              <p className="text-sm text-slate-400">{label as string}</p>
              <p className="mt-3 text-4xl font-semibold">{value as number}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["/api/clients", "Client CRUD, search, and pagination."],
            ["/api/services", "Service CRUD with pricing and duration."],
            [
              "/api/orders",
              "Order creation, status history, and cancellations.",
            ],
            [
              "/api/message-templates",
              "Template management and content editing.",
            ],
            ["/api/schedules", "Future schedules and processing simulation."],
            [
              "/api/follow-up-triggers",
              "Automatic follow-up trigger configuration.",
            ],
          ].map(([path, description]) => (
            <article
              key={path as string}
              className="rounded-3xl border border-white/10 bg-white/6 p-6 backdrop-blur"
            >
              <p className="font-mono text-sm text-slate-400">
                {path as string}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {description as string}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
