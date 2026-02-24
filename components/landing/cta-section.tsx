import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 text-center dark:bg-zinc-800">
          {/* Background accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute bottom-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-zinc-700 opacity-30 blur-3xl" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Get Started Today
          </p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Stop reconciling spreadsheets. Start running your business.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Salarium automates every financial calculation your field service
            business relies on. Set it up once and let the database handle the
            rest.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-100 hover:shadow-md"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-zinc-300 ring-1 ring-zinc-700 transition-all hover:bg-zinc-800"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
