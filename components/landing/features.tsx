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
    <section id="features" className="bg-muted py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            What We Build For You
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Solutions that fit your business, not the other way around
          </h2>
          <p className="mt-4 text-muted-foreground">
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
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
