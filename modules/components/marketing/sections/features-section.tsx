import type { ReactNode } from "react";

import type { FeatureBlock } from "@/modules/components/marketing/content";
import { marketingCopy } from "@/modules/components/marketing/content";
import { SectionHeader } from "@/modules/components/marketing/sections/section-header";
import { cn } from "@/modules/lib/utils";

import { FlashcardFlipDemo } from "../features/flashcard-flip-demo";
import { OrganizationGridDemo } from "../features/organization-grid-demo";
import { ProgressChartDemo } from "../features/progress-chart-demo";

const featureMedia: Record<FeatureBlock["media"], ReactNode> = {
  flashcard: <FlashcardFlipDemo />,
  progress: <ProgressChartDemo />,
  organization: <OrganizationGridDemo />,
};

function FeatureBlockSection({
  eyebrow,
  title,
  paragraphs,
  points,
  media,
  layout,
  divider,
  spacing,
}: FeatureBlock) {
  const isMediaLeft = layout === "media-left";
  const mediaNode = featureMedia[media];

  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
        divider === "top" && "border-t border-foreground/10",
        spacing,
      )}
    >
      <div
        className={cn(
          isMediaLeft ? "order-2 lg:order-1" : "order-1 lg:order-2",
        )}
      >
        {mediaNode}
      </div>
      <div
        className={cn(
          isMediaLeft ? "order-1 lg:order-2" : "order-2 lg:order-1",
        )}
      >
        <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary mb-4">
          {eyebrow}
        </p>
        <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
          {title}
        </h3>
        {paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-base text-muted-foreground leading-relaxed mb-5 last:mb-8"
          >
            {paragraph}
          </p>
        ))}
        <div className="space-y-4 text-sm text-foreground">
          {points.map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const { features } = marketingCopy;

  return (
    <section
      id="features"
      className="scroll-mt-32 pb-24 px-4 lg:px-6 bg-card/30"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader eyebrow={features.eyebrow} className="mb-24 lg:mb-28">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.02]">
              {features.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {features.description}
            </p>
          </div>
        </SectionHeader>

        {features.blocks.map((feature) => (
          <FeatureBlockSection key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}
