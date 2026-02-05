"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/modules/components/ui/button";

export function AnimatedCTA() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x: x * 0.1, y: y * 0.1 });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="flex flex-col sm:flex-row gap-4"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="cta-button"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <Button size="lg" asChild className="text-base px-8 py-6 h-auto">
          <Link href="/signup">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>

      <div
        className="cta-button"
        style={{
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <Button
          size="lg"
          variant="outline"
          asChild
          className="text-base px-8 py-6 h-auto"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
