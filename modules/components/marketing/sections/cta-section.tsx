import { Button } from "@/modules/components/ui/button";
import { VertoLogo } from "@/modules/components/ui/logo";
import { marketingCopy } from "@/modules/components/marketing/content";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  const { cta } = marketingCopy;

  return (
    <section
      id="get-started"
      className="scroll-mt-32 py-24 lg:py-28 px-4 lg:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {cta.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {cta.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                {cta.primaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">{cta.secondaryCta}</Link>
            </Button>
          </div>
          <div className="mt-16 flex flex-row justify-center gap-8 items-center text-muted-foreground">
            <VertoLogo size="lg" />
            <p className="text-sm">{cta.footer.copyright}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
