const stats = [
  {
    value: "9",
    label: "Spreadsheets replaced",
    description:
      "Per-tech logs, daily gross/net, estimates, P&L, and Orlando jobs — all in one place",
  },
  {
    value: "$92K+",
    label: "Monthly team gross tracked",
    description:
      "February 2026 actuals, updating in real time as jobs are logged",
  },
  {
    value: "50 / 75%",
    label: "Commission splits automated",
    description:
      "Both rate tiers calculated server-side per technician — no manual formulas",
  },
  {
    value: "5",
    label: "Technicians managed",
    description:
      "Tamir, Yotam, Shalom, Aviran, and the 3 Bros sub crew tracked individually",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-zinc-900 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            The Numbers
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Built to eliminate financial guesswork
          </h2>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, description }) => (
            <div
              key={label}
              className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 text-center"
            >
              <div className="mb-1 text-4xl font-extrabold tracking-tight text-zinc-50">
                {value}
              </div>
              <div className="mb-2 text-sm font-semibold text-zinc-300">
                {label}
              </div>
              <p className="text-xs leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
