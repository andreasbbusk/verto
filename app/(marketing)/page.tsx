import { studySteps } from "@/modules/components/marketing/content";
import { BenefitsSection } from "@/modules/components/marketing/sections/benefits-section";
import { CtaSection } from "@/modules/components/marketing/sections/cta-section";
import { FeaturesSection } from "@/modules/components/marketing/sections/features-section";
import { HeroSection } from "@/modules/components/marketing/sections/hero-section";
import { StudyLoopSection } from "@/modules/components/marketing/sections/study-loop-section";
import { MarketingHeader } from "@/modules/components/marketing/navigation";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StudyLoopSection steps={studySteps} />
        <BenefitsSection />
        <CtaSection />
      </main>
    </div>
  );
}
