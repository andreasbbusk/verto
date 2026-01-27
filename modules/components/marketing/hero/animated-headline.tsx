"use client";

import { useRef } from "react";
import {
  gsap,
  useIsomorphicLayoutEffect,
} from "@/modules/components/marketing/gsap/gsap-config";

interface AnimatedHeadlineProps {
  children: string;
  className?: string;
}

export function AnimatedHeadline({
  children,
  className = "",
}: AnimatedHeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (!headlineRef.current) return;

    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(wordsRef.current, {
        opacity: 0,
        y: 100,
        rotateX: -90,
      });

      // Animate in
      gsap.to(wordsRef.current, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });
    }, headlineRef);

    return () => ctx.revert();
  }, []);

  // Split text into words
  const words = children.split(" ");

  return (
    <h1
      ref={headlineRef}
      className={className}
      style={{ perspective: "1000px" }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => {
            if (el) wordsRef.current[index] = el;
          }}
          className="inline-block"
          style={{ transformOrigin: "50% 100%" }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </h1>
  );
}
