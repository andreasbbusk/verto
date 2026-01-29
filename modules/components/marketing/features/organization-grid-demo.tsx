"use client";

import { useEffect, useRef } from "react";
import { BookOpen, Brain, Code, Globe } from "lucide-react";
import { gsap } from "@/modules/components/marketing/gsap/gsap-config";
import { Card } from "@/modules/components/ui/card";

const sets = [
  { icon: Brain, title: "Psychology", count: 47, color: "primary" },
  { icon: Code, title: "JavaScript", count: 89, color: "primary" },
  { icon: Globe, title: "Geography", count: 64, color: "primary" },
  { icon: BookOpen, title: "Literature", count: 32, color: "primary" },
];

export function OrganizationGridDemo() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from(cardsRef.current, {
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.4)",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full aspect-[3/2]">
      {/* Search bar */}
      <div className="mb-4 p-3 border border-border rounded bg-input">
        <div className="text-sm text-muted-foreground font-mono">
          Search sets...
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {sets.map((set, index) => (
          <Card
            key={set.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="p-4 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded border border-border flex items-center justify-center shrink-0 bg-primary/10">
                <set.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-semibold text-foreground truncate">
                  {set.title}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {set.count} cards
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer indicator */}
      <div className="mt-4 text-xs text-muted-foreground font-mono text-center">
        4 sets • Drag to reorder
      </div>
    </div>
  );
}
