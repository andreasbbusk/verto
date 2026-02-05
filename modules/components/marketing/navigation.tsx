"use client";

import { Button } from "@/modules/components/ui/button";
import { VertoLogo } from "@/modules/components/ui/logo";
import { marketingCopy } from "@/modules/components/marketing/content";
import { useScrollDirection } from "@/modules/hooks/useScrollDirection";
import Link from "next/link";

export function MarketingHeader() {
  const isVisible = useScrollDirection();
  const { header } = marketingCopy;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="bg-background rounded-2xl border border-foreground/10 shadow-[0_12px_30px_rgba(8,8,8,0.12)]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 py-3">
            {/* Left: Logo */}
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
              aria-label={header.ariaLabel}
            >
              <VertoLogo size="md" textClassName="text-base sm:text-lg" />
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center gap-8">
              {header.nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right: Auth Buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/login">{header.auth.signIn}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">{header.auth.getStarted}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
