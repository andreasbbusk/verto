import { cn } from "@/modules/lib/utils";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  className?: string;
  children: ReactNode;
};

export function SectionHeader({ eyebrow, className, children }: SectionHeaderProps) {
  return (
    <div className={cn("mb-16", className)}>
      <div className="flex items-center gap-3 text-xs font-mono font-semibold uppercase tracking-[0.2em] text-primary">
        <span className="h-px w-10 bg-primary" />
        {eyebrow}
      </div>
      <div className="mt-4 h-px w-full bg-foreground/10" />
      <div className="mt-8">{children}</div>
    </div>
  );
}
