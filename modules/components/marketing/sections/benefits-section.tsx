import { marketingCopy } from "@/modules/components/marketing/content";
import { cn } from "@/modules/lib/utils";
import { SectionHeader } from "./section-header";

const benefitLayout: Record<string, string> = {
  wide: "lg:col-span-7",
  narrow: "lg:col-span-5",
};

export function BenefitsSection() {
  const { benefits } = marketingCopy;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 py-16 px-4 lg:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow={benefits.eyebrow} className="mb-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight max-w-2xl">
              {benefits.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {benefits.description}
            </p>
          </div>
        </SectionHeader>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 pt-8 items-stretch">
          {benefits.items.map((benefit) => (
            <article
              key={benefit.title}
              className={cn(
                "rounded-2xl border border-foreground/10 bg-card/70 p-6 sm:p-7 transition-colors hover:border-foreground/25",
                benefitLayout[benefit.layout] ?? "lg:col-span-6"
              )}
            >
              <h3 className="mt-3 font-mono text-lg sm:text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>

              <div className="mt-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary">
                  {benefit.evidenceLabel}
                </div>
                <p className="mt-2 text-sm font-mono font-semibold text-foreground">
                  {benefit.evidenceTitle}
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {benefit.evidenceText}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
