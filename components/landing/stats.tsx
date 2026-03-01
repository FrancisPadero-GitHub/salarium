const stats = [
  {
    value: "100%",
    label: "Custom-built",
    description:
      "Every solution is designed from the ground up around your specific business needs",
  },
  {
    value: "24/7",
    label: "Always available",
    description:
      "Your system runs around the clock so you can access your data whenever you need it",
  },
  {
    value: "Zero",
    label: "Spreadsheets needed",
    description:
      "We replace manual tracking with automated systems that do the work for you",
  },
  {
    value: "On Request",
    label: "New features delivered",
    description:
      "Need something new? Just ask. We build and ship custom features as your business grows",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-zinc-900 py-24 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Your business deserves more than generic software
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
