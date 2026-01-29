"use client";

import { Button } from "@/modules/components/ui/button";
import { useScrollDirection } from "@/modules/hooks/useScrollDirection";
import Link from "next/link";

export function MarketingHeader() {
  const isVisible = useScrollDirection();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-card backdrop-blur-sm rounded-2xl border border-border/50">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Left: Logo */}
            <Link
              href="/"
              className="flex items-center text-foreground hover:text-primary transition-colors"
              aria-label="Verto home"
            >
              <span className="font-mono text-base sm:text-lg tracking-tight">
                Verto
              </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8">
              <a
                href="#features"
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
            </nav>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
