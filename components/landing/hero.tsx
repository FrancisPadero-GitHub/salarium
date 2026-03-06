import Link from "next/link";
import { ArrowRight, Wrench, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-24">
      {/* Subtle gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute top-0 left-1/2 h-150 w-225 -translate-x-1/2 rounded-full bg-secondary opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          Your Virtual Assistant for Business Operations
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl">
          We solve your <span className="text-muted-foreground">business problems</span>{" "}
          so you don&apos;t have to
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Klicktiv centralizes job reporting, automates commission splits, and
          delivers synchronous revenue dashboards, built for chimney, HVAC, and
          dryer vent service businesses tired of juggling spreadsheets.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="https://advancedvirtualstaff.com/booking"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-sm transition-all hover:opacity-90 hover:shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request a consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-foreground ring-1 ring-border transition-all hover:bg-muted"
          >
            See how it works
          </Link>
        </div>

        {/* Social proof line */}
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          {[
            { icon: Wrench, text: "Fully customizable to your needs" },
            { icon: Sparkles, text: "Built and managed for you" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
