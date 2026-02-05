"use client";

import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { marketingCopy } from "@/modules/components/marketing/content";

export function ProgressChartDemo() {
  const { progress } = marketingCopy.demos;

  return (
    <div className="relative w-full max-w-[720px] mx-auto space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {progress.stats.map((stat) => (
          <Card key={stat.label} className="gap-4 px-4 py-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs font-mono font-semibold uppercase tracking-wide text-primary">
                  {stat.label}
                </div>
                <div className="text-2xl font-mono font-semibold text-foreground">
                  {stat.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5">
        <Card className="p-8">
          <div className="mb-6">
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary">
              {progress.recentActivity.eyebrow}
            </p>
            <h3 className="mt-3 font-mono text-2xl font-bold text-foreground">
              {progress.recentActivity.title}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              {progress.recentActivity.description}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  {progress.recentActivity.mostRecentLabel}
                </p>
                <p className="font-mono text-sm text-foreground">
                  {progress.recentActivity.mostRecentName}
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {progress.recentActivity.mostRecentCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progress.recentActivity.lastStudiedLabel}</span>
              <span>{progress.recentActivity.lastStudiedValue}</span>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              {progress.recentActivity.resumeCta}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
