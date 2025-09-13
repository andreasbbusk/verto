"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/modules/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/components/ui/sheet";
import { UserMenu } from "./user-menu";
import { cn } from "@/modules/lib/utils";
import {
  Home,
  Library,
  Calendar,
  Settings,
  GraduationCap,
  Menu,
  Plus,
  BookOpen,
} from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Oversigt og statistikker",
  },
  {
    name: "Mine Sets",
    href: "/sets",
    icon: Library,
    description: "Administrer dine flashcard sets",
  },
  {
    name: "Kalender",
    href: "/calendar",
    icon: Calendar,
    description: "Se din studiehistorik",
  },
  {
    name: "Indstillinger",
    href: "/settings",
    icon: Settings,
    description: "Personlige præferencer",
  },
];

const quickActions = [
  {
    name: "Nyt Set",
    href: "/sets/new",
    icon: Plus,
    variant: "default" as const,
  },
  {
    name: "Nyt Kort",
    href: "/cards",
    icon: BookOpen,
    variant: "outline" as const,
  },
];

interface AppNavigationProps {
  children: React.ReactNode;
}

export function AppNavigation({ children }: AppNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    // Handle root dashboard route
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    // Handle other routes with exact matching for better UX
    if (href === "/calendar") {
      return pathname === "/calendar";
    }
    if (href === "/settings") {
      return pathname === "/settings" || pathname.startsWith("/settings");
    }
    // For sets, match the base path and sub-paths
    if (href === "/sets") {
      return pathname === "/sets" || pathname.startsWith("/sets/");
    }
    return pathname.startsWith(href);
  };

  const NavigationItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
              active
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                active
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-600"
              )}
            />
            <div className="flex-1">
              <div>{item.name}</div>
              {!mobile && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              )}
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Fixed position for mobile */}
      <div className="fixed top-4 left-4 z-40 lg:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white shadow-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  FlashCards
                </span>
              </SheetTitle>
              <SheetDescription className="text-left">
                Navigér til forskellige sektioner af appen
              </SheetDescription>
            </SheetHeader>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <NavigationItems mobile />
            </nav>

            {/* Mobile Quick Actions */}
            <div className="border-t border-gray-200 p-4 space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span>{action.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Menu */}
            <div className="border-t border-gray-200 p-4">
              <UserMenu />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 hidden lg:flex lg:flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FlashCards</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavigationItems />
        </nav>

        {/* Desktop Quick Actions */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Hurtige handlinger
          </div>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button
                  variant={action.variant}
                  size="sm"
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.name}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Desktop User Menu at bottom */}
        <div className="border-t border-gray-200 p-4">
          <UserMenu />
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
