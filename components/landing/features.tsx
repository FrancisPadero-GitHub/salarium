import {
  ClipboardList,
  Calculator,
  BarChart3,
  FileText,
  Users,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Centralized Job Logging",
    description:
      "Capture every job detail in one place — date, address, technician, parts costs, tips, subtotals, and payment method.",
  },
  {
    icon: Calculator,
    title: "Automated Commission Splits",
    description:
      "50% and 75% commission splits calculated at the database level. No formulas, no manual math, no errors.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboards",
    description:
      "Daily gross, daily net, monthly performance, and year-to-date revenue update the moment a job is logged.",
  },
  {
    icon: FileText,
    title: "Estimate Pipeline",
    description:
      "Track pending proposals and convert approved estimates into active jobs with a single click.",
  },
  {
    icon: Users,
    title: "Technician Management",
    description:
      "Maintain a centralized technician directory with configurable commission rates per team member.",
  },
  {
    icon: ShieldCheck,
    title: "Server-Enforced Accuracy",
    description:
      "PostgreSQL constraints and generated columns protect every calculation. The database is the single source of truth.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-zinc-50 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Platform Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Everything your field service business needs
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            Salarium replaces disconnected spreadsheets with a unified,
            automated financial system designed for the realities of field
            service operations.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
