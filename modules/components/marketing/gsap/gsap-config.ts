"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reusable animation presets
 */
export const animations = {
  fadeIn: {
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  },
  fadeInUp: {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out",
  },
  fadeInDown: {
    opacity: 0,
    y: -40,
    duration: 0.8,
    ease: "power3.out",
  },
  slideInLeft: {
    opacity: 0,
    x: -60,
    duration: 0.9,
    ease: "power3.out",
  },
  slideInRight: {
    opacity: 0,
    x: 60,
    duration: 0.9,
    ease: "power3.out",
  },
  scale: {
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    ease: "back.out(1.4)",
  },
  stagger: {
    amount: 0.3,
  },
};

/**
 * Common ScrollTrigger configurations
 */
export const scrollTriggerConfig = {
  default: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse",
  },
  sticky: {
    start: "top top",
    end: "bottom bottom",
    pin: true,
    scrub: true,
  },
  scrub: {
    start: "top bottom",
    end: "bottom top",
    scrub: 1,
  },
};

/**
 * Utility functions for common animation patterns
 */
export const gsapUtils = {
  /**
   * Animate elements in on scroll
   */
  scrollFadeIn: (
    element: gsap.DOMTarget,
    options?: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars }
  ) => {
    const { scrollTrigger: customScrollTrigger, ...restOptions } =
      options || {};
    const triggerConfig: ScrollTrigger.Vars = {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    };
    if (customScrollTrigger) {
      Object.assign(triggerConfig, customScrollTrigger);
    }
    return gsap.from(element, {
      ...animations.fadeInUp,
      ...restOptions,
      scrollTrigger: triggerConfig,
    });
  },

  /**
   * Stagger animation for multiple elements
   */
  staggerFadeIn: (
    elements: gsap.DOMTarget,
    options?: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars }
  ) => {
    const { scrollTrigger: customScrollTrigger, ...restOptions } =
      options || {};
    const triggerConfig: ScrollTrigger.Vars = {
      trigger: elements,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    };
    if (customScrollTrigger) {
      Object.assign(triggerConfig, customScrollTrigger);
    }
    return gsap.from(elements, {
      ...animations.fadeInUp,
      ...restOptions,
      stagger: animations.stagger.amount,
      scrollTrigger: triggerConfig,
    });
  },

  /**
   * Parallax effect
   */
  parallax: (element: gsap.DOMTarget, speed: number = 0.5) => {
    return gsap.to(element, {
      y: () => {
        return -ScrollTrigger.maxScroll(window) * speed;
      },
      ease: "none",
      scrollTrigger: {
        trigger: element,
        ...scrollTriggerConfig.scrub,
        invalidateOnRefresh: true,
      },
    });
  },

  /**
   * Smooth reveal with scale
   */
  scaleIn: (
    element: gsap.DOMTarget,
    options?: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars }
  ) => {
    const { scrollTrigger: customScrollTrigger, ...restOptions } =
      options || {};
    const triggerConfig: ScrollTrigger.Vars = {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
    };
    if (customScrollTrigger) {
      Object.assign(triggerConfig, customScrollTrigger);
    }
    return gsap.from(element, {
      ...animations.scale,
      ...restOptions,
      scrollTrigger: triggerConfig,
    });
  },

  /**
   * Split text reveal (word by word)
   */
  splitTextReveal: (words: gsap.DOMTarget, options?: gsap.TweenVars) => {
    return gsap.from(words, {
      opacity: 0,
      y: 30,
      rotateX: -90,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      ...(options || {}),
    });
  },
};

/**
 * Refresh ScrollTrigger instances
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

/**
 * Kill all ScrollTrigger instances
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export { gsap, ScrollTrigger };
