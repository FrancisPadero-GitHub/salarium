import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 pb-24 dark:bg-zinc-950">
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-zinc-100 opacity-60 blur-3xl dark:bg-zinc-800 dark:opacity-30" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-500" />
          Server-enforced financial accuracy
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
          Replace spreadsheets with{" "}
          <span className="text-zinc-500">automated financial clarity</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          Salarium centralizes job reporting, automates commission splits, and
          delivers real-time revenue dashboards, built for chimney, HVAC, and
          dryer vent service businesses tired of juggling spreadsheets.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-700 hover:shadow-md dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-zinc-700 ring-1 ring-zinc-200 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-900"
          >
            See how it works
          </Link>
        </div>

        {/* Social proof line */}
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          {[
            { icon: TrendingUp, text: "Real-time revenue dashboards" },
            { icon: ShieldCheck, text: "Database-level calculation integrity" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
            >
              <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
