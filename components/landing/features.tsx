import {
  ClipboardList,
  Calculator,
  BarChart3,
  FileText,
  Users,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Job & Task Tracking",
    description:
      "We set up a centralized system to capture every job detail, from scheduling and assignments to costs and payment collection.",
  },
  {
    icon: Calculator,
    title: "Automated Financial Calculations",
    description:
      "Commission splits, payroll breakdowns, and revenue summaries computed automatically. No spreadsheets, no manual math.",
  },
  {
    icon: BarChart3,
    title: "Live Performance Dashboards",
    description:
      "Get real-time visibility into revenue, expenses, and team performance with dashboards that update the moment data changes.",
  },
  {
    icon: FileText,
    title: "Estimates & Proposals",
    description:
      "Track pending proposals, manage approvals, and convert estimates into active jobs with a single click.",
  },
  {
    icon: Users,
    title: "Team & Partner Management",
    description:
      "Manage your team, subcontractors, or partners with individual profiles, rates, and performance tracking.",
  },
  {
    icon: Wrench,
    title: "Fully Customizable on Request",
    description:
      "Every feature can be tailored to your specific workflow. Need something unique? Just tell us and we will build it for you.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-zinc-50 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            What We Build For You
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Solutions that fit your business, not the other way around
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            We handle the technical complexity so you can focus on operations.
            Every feature is built around your real-world needs and can be
            customized at any time.
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
