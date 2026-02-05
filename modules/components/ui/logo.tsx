import { cn } from "@/modules/lib/utils";
import { Layers } from "lucide-react";

type LogoSize = "sm" | "md" | "lg";

const sizeStyles: Record<LogoSize, { box: string; icon: string; text: string }> =
  {
    sm: {
      box: "h-6 w-6",
      icon: "h-3 w-3",
      text: "text-xs",
    },
    md: {
      box: "h-7 w-7",
      icon: "h-3.5 w-3.5",
      text: "text-sm",
    },
    lg: {
      box: "h-9 w-9",
      icon: "h-4 w-4",
      text: "text-base",
    },
  };

export interface VertoLogoProps {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  markClassName?: string;
  iconClassName?: string;
}

export function VertoLogo({
  size = "md",
  showText = true,
  className,
  textClassName,
  markClassName,
  iconClassName,
}: VertoLogoProps) {
  const styles = sizeStyles[size];

  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-md border-2 border-foreground bg-background shadow-[2px_2px_0px_0px_#111111]",
          styles.box,
          markClassName
        )}
      >
        <Layers className={cn("text-current", styles.icon, iconClassName)} />
      </span>
      {showText ? (
        <span className={cn("font-mono tracking-tight text-current", styles.text, textClassName)}>
          Verto
        </span>
      ) : null}
    </span>
  );
}
