"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/modules/components/marketing/gsap/gsap-config";
import { Card } from "@/modules/components/ui/card";

const progressData = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 85 },
  { day: "Sat", value: 72 },
  { day: "Sun", value: 90 },
];

export function ProgressChartDemo() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate bars on mount
      gsap.from(barsRef.current, {
        scaleY: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        transformOrigin: "bottom",
      });

      // Continuous pulsing animation
      gsap.to(barsRef.current, {
        opacity: 0.7,
        stagger: {
          each: 0.2,
          repeat: -1,
          yoyo: true,
        },
        duration: 1.5,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Card
      ref={containerRef}
      className="relative w-full aspect-[3/2] p-6 bg-card"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm font-mono text-muted-foreground mb-1">
          WEEKLY PROGRESS
        </div>
        <div className="text-3xl font-mono text-foreground">72%</div>
        <div className="text-xs text-primary font-mono">+12% vs last week</div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-32">
        {progressData.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center">
            <div className="flex-1 w-full flex items-end">
              <div
                ref={(el) => {
                  barsRef.current[index] = el;
                }}
                className="w-full bg-primary/80 rounded-t"
                style={{ height: `${item.value}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-2">
              {item.day}
            </div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs font-mono">
        <div>
          <div className="text-muted-foreground">Cards studied</div>
          <div className="text-foreground font-semibold">247</div>
        </div>
        <div>
          <div className="text-muted-foreground">Accuracy</div>
          <div className="text-foreground font-semibold">86%</div>
        </div>
        <div>
          <div className="text-muted-foreground">Streak</div>
          <div className="text-foreground font-semibold">12 days</div>
        </div>
      </div>
    </Card>
  );
}
