import { FlashcardFlipDemo } from "./flashcard-flip-demo";
import { OrganizationGridDemo } from "./organization-grid-demo";
import { ProgressChartDemo } from "./progress-chart-demo";

export function AnimatedFeaturesSection() {
  return (
    <section className="py-32 lg:py-36 px-4 lg:px-6 bg-card/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-24 lg:mb-28">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-10 bg-foreground/20" />
            Core features
          </div>
          <div className="mt-4 h-px w-full bg-foreground/10" />
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.02]">
              Everything you need to learn effectively
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Research-backed features designed to maximize retention and minimize
              study time. Built for clarity, consistency, and measurable progress.
            </p>
          </div>
        </div>

        {/* Feature 1 - Spaced Repetition */}
        <div className="mb-36 lg:mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center  pt-16">
          <div className="order-2 lg:order-1">
            <FlashcardFlipDemo />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Study session
            </p>
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              A focused study flow
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-5">
              Flip through cards with clear focus states, quick actions, and a
              layout that keeps you in momentum. Every screen is designed to
              minimize friction and keep the next step obvious.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              The session UI mirrors the real study experience, so what you see
              here is what you get when you are in the app.
            </p>
            <div className="space-y-4 text-sm text-foreground">
              {[
                "Adaptive difficulty adjustment based on your performance",
                "Optimal review timing to prevent forgetting",
                "Focus on cards that need the most attention",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 2 - Progress Tracking */}
        <div className="mb-36 lg:mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center border-t border-foreground/10 pt-16">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Dashboard
            </p>
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              Progress that matches the app
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-5">
              Track cards studied, session volume, and daily goals using the
              same stat cards and activity summaries found in the dashboard.
              It is a direct reflection of the product surface.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              The layout stays familiar whether you are in the product or on
              the marketing page, so users instantly recognize the interface.
            </p>
            <div className="space-y-4 text-sm text-foreground">
              {[
                "Daily study streaks to build consistent habits",
                "Performance analytics per set and card",
                "Customizable study goals to keep you on track",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <ProgressChartDemo />
          </div>
        </div>

        {/* Feature 3 - Easy Organization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center border-t border-foreground/10 pt-16">
          <div className="order-2 lg:order-1">
            <OrganizationGridDemo />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Sets library
            </p>
            <h3 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">
              A library that looks like your library
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed mb-5">
              The marketing preview mirrors the actual set cards, from the left
              accent bar to the study/edit controls. It is the same layout, just
              focused for a quick scan.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed mb-8">
              Users recognize the UI instantly and understand how sets are
              organized before they even sign up.
            </p>
            <div className="space-y-4 text-sm text-foreground">
              {[
                "Unlimited sets and cards for all your subjects",
                "Star cards and filter by due date or starred status",
                "Edit cards on the fly during study sessions",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
