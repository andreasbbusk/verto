"use client";

import { useEffect, useState } from "react";

export const useScrollDirection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      // Only hide if scrolled down more than 80px
      if (scrollY < 80) {
        setIsVisible(true);
      } else if (scrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else if (scrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(scrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [lastScrollY]);

  return isVisible;
};
