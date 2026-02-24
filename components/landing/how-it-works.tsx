const steps = [
  {
    number: "01",
    title: "Add your technicians",
    description:
      "Create profiles for each technician and configure their individual commission rates. Salarium maps every job automatically.",
  },
  {
    number: "02",
    title: "Log jobs as they complete",
    description:
      "Enter job details, address, parts cost, tips, subtotal, and payment method, through the unified job entry interface.",
  },
  {
    number: "03",
    title: "Let the database calculate",
    description:
      "Commission splits, subtotals, and revenue totals are computed server-side the moment a job is saved. No manual formulas.",
  },
  {
    number: "04",
    title: "Monitor your financials in real time",
    description:
      "Access live dashboards showing daily gross, daily net, and year-to-date performance. Always accurate, always up to date.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Operational in four steps
          </h2>
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            From setup to real-time financial clarity, Salarium is designed to
            get out of your way and let you focus on running the business.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description }, index) => (
            <div key={number} className="relative flex flex-col">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-full hidden h-px w-8 bg-zinc-200 dark:bg-zinc-800 lg:block" />
              )}

              <div className="mb-4 text-4xl font-black tracking-tighter text-zinc-100 dark:text-zinc-800">
                {number}
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
