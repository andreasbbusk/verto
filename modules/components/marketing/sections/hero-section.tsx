import { marketingCopy } from "@/modules/components/marketing/content";
import { Button } from "@/modules/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  const { hero } = marketingCopy;

  return (
    <section className="relative px-4 lg:px-6 pt-24 lg:pt-28 pb-12 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto space-y-8 lg:space-y-10">
          <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-[0.96]">
            {hero.title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">{hero.primaryCta}</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#features">{hero.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
