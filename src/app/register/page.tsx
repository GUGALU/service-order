"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Unable to create the account.");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur"
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Bootstrap
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Create an account</h1>
          <p className="mt-2 text-sm text-slate-300">
            Create the first operator account and then sign in.
          </p>
        </div>

        <label className="block space-y-2 text-sm">
          <span>Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            type="text"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-white/30"
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Email</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-white/30"
            required
          />
        </label>

        <label className="block space-y-2 text-sm">
          <span>Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-white/30"
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
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a className="text-white underline underline-offset-4" href="/login">
            Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
