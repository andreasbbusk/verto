"use client";

import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";

export function ProgressChartDemo() {
  return (
    <div className="relative w-full max-w-[720px] mx-auto space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Cards studied
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                247
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Study sessions
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                18
              </div>
            </div>
          </div>
        </Card>
        <Card className="gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                Daily goal
              </div>
              <div className="text-2xl font-mono font-semibold text-foreground">
                20 cards
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-5">
        <Card className="p-8">
          <div className="mb-6">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Recent activity
            </p>
            <h3 className="mt-3 font-mono text-2xl font-bold text-foreground">
              Keep track of your latest set
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Most recent sets and study status
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Most recent set</p>
                <p className="font-mono text-sm text-foreground">
                  Cognitive Psychology Essentials
                </p>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                28 cards
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last studied</span>
              <span>Feb 5, 2026</span>
            </div>
            <Button size="sm" variant="outline" className="w-full">
              Resume session
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
