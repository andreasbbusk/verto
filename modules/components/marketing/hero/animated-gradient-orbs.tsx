"use client";

import { useRef } from "react";
import {
  gsap,
  useIsomorphicLayoutEffect,
} from "@/modules/components/marketing/gsap/gsap-config";

export function AnimatedGradientOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate orbs with different speeds and paths
      gsap.to(orb1Ref.current, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: "random(8, 12)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(orb2Ref.current, {
        x: "random(-150, 150)",
        y: "random(-150, 150)",
        duration: "random(10, 15)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(orb3Ref.current, {
        x: "random(-80, 80)",
        y: "random(-80, 80)",
        duration: "random(7, 11)",
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Rotation animations
      gsap.to([orb1Ref.current, orb2Ref.current, orb3Ref.current], {
        rotate: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Orb 1 - Mustard */}
      <div
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, #ECCB45 0%, transparent 70%)",
        }}
      />

      {/* Orb 2 - Cream */}
      <div
        ref={orb2Ref}
        className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, #FFFCF2 0%, transparent 70%)",
        }}
      />

      {/* Orb 3 - Mustard accent */}
      <div
        ref={orb3Ref}
        className="absolute bottom-1/4 left-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
        style={{
          background:
            "radial-gradient(circle, #ECCB45 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
