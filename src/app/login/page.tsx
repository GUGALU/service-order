"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Unable to sign in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Access control
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-300">
            Use the account registered through the API to access the dashboard.
          </p>
        </div>

        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 transition focus:border-white/30"
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none ring-0 transition focus:border-white/30"
            required
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Need an account?{" "}
          <a
            className="text-white underline underline-offset-4"
            href="/register"
          >
            Create one
          </a>
        </p>
      </form>
    </main>
  );
}
