"use client";

import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Simple animation wrapper component
 * Currently a passthrough, but can be extended with framer-motion or other animation libraries
 */
export function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
