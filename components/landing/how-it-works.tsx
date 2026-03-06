const steps = [
  {
    number: "01",
    title: "Tell us your pain points",
    description:
      "Schedule a consultation and walk us through the challenges slowing your business down. We listen, ask the right questions, and map out a plan.",
  },
  {
    number: "02",
    title: "We build your custom solution",
    description:
      "Our team designs and develops a system tailored to your exact workflow, whether it is job tracking, financial reporting, or team management.",
  },
  {
    number: "03",
    title: "You start using it immediately",
    description:
      "We set everything up, migrate your data if needed, and walk you through the platform. You are operational from day one.",
  },
  {
    number: "04",
    title: "Request changes anytime",
    description:
      "Need a new report, a different workflow, or an extra feature? Just let us know. We iterate and customize as your business evolves.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            How It Works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            From problem to solution in four steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            We handle the heavy lifting so you can focus on running your
            business. No technical knowledge required on your end.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description }, index) => (
            <div key={number} className="relative flex flex-col">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-full hidden h-px w-8 bg-border lg:block" />
              )}

              <div className="mb-4 text-4xl font-black tracking-tighter text-secondary">
                {number}
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
