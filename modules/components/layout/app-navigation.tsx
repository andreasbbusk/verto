"use client";

import { Button } from "@/modules/components/ui/button";
import { Kbd } from "@/modules/components/ui/kbd";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/modules/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/components/ui/tooltip";
import { useSets } from "@/modules/hooks/use-sets";
import { cn } from "@/modules/lib/utils";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Home,
  Library,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlashcardDialog } from "../flashcards/flashcard-dialog";
import { CommandPalette } from "./command-palette";
import { UserMenu } from "./user-menu";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Flashcard Sæt",
    href: "/sets",
    icon: Library,
  },
  {
    name: "Kalender",
    href: "/calendar",
    icon: Calendar,
    disabled: true,
  },
];

const quickActions = [
  {
    name: "Nyt Sæt",
    href: "/sets?create=true",
    icon: Plus,
  },
  {
    name: "Nyt Kort",
    href: "#",
    icon: BookOpen,
    action: "create-card" as const,
  },
];

interface AppNavigationProps {
  children: React.ReactNode;
}

function SetMenuItem({ set, isActive }: { set: any; isActive: boolean }) {
  const MAX_LENGTH = 20;
  const isTruncated = set.name.length > MAX_LENGTH;
  const displayName = isTruncated
    ? `${set.name.slice(0, MAX_LENGTH)}...`
    : set.name;

  return (
    <SidebarMenuSubItem className="relative">
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full z-10" />
      )}
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="w-full">
            <SidebarMenuSubButton
              asChild
              isActive={isActive}
              className={cn(
                "hover:bg-sidebar-accent w-full",
                isActive &&
                  "bg-[var(--color-sidebar-accent-active)] hover:bg-[var(--color-sidebar-accent-active)]"
              )}
            >
              <Link
                href={`/sets/${set.id}`}
                className="flex items-center gap-2 w-full min-w-0"
              >
                <span className="text-xs text-muted-foreground w-6 flex-shrink-0 ml-1">
                  {set.cardCount || 0}
                </span>
                <span className="text-sm flex-1">{displayName}</span>
              </Link>
            </SidebarMenuSubButton>
          </div>
        </TooltipTrigger>
        {isTruncated && (
          <TooltipContent side="right">
            <p>{set.name}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </SidebarMenuSubItem>
  );
}

export function AppNavigation({ children }: AppNavigationProps) {
  const pathname = usePathname();
  const { sets, isLoading } = useSets();
  const [setsExpanded, setSetsExpanded] = useState(true);
  const [createCardDialogOpen, setCreateCardDialogOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        {/* Sidebar Header */}
        <SidebarHeader className="px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="text-lg font-semibold text-sidebar-foreground font-mono">
              FlashCards
            </span>
          </Link>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 mb-2 font-mono">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-3 gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  // Special handling for Flashcard Sæt with dropdown
                  if (item.href === "/sets") {
                    return (
                      <SidebarMenuItem key={item.href}>
                        <div className="relative">
                          {active && !pathname.includes("/sets/") && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                          )}
                          <div
                            className={cn(
                              "w-full h-auto py-2 px-3 rounded-md hover:bg-sidebar-accent flex items-center gap-3 transition-colors",
                              active &&
                                !pathname.includes("/sets/") &&
                                "bg-[var(--color-sidebar-accent-active)]"
                            )}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 flex-1 min-w-0"
                              onClick={() => setSetsExpanded(true)}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium text-sm">
                                {item.name}
                              </span>
                            </Link>
                            <button
                              onClick={() => setSetsExpanded(!setsExpanded)}
                              className="flex-shrink-0 p-1 hover:bg-sidebar-accent-active rounded transition-colors"
                            >
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 transition-transform",
                                  setsExpanded && "rotate-90"
                                )}
                              />
                            </button>
                          </div>
                        </div>
                        <motion.div
                          initial={false}
                          animate={{
                            height: setsExpanded ? "auto" : 0,
                            opacity: setsExpanded ? 1 : 0,
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div
                            className={cn(sets.length > 5 && "max-h-[200px]")}
                          >
                            <ScrollArea
                              className={cn(sets.length > 5 && "h-[200px]")}
                            >
                              <SidebarMenuSub className="pr-2">
                                {isLoading ? (
                                  <div className="py-2 space-y-2">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                      <div key={i} className="h-6 bg-sidebar-accent/50 rounded animate-pulse" />
                                    ))}
                                  </div>
                                ) : sets.length === 0 ? (
                                  <p className="px-3 py-2 text-xs text-muted-foreground">
                                    Ingen sæt endnu
                                  </p>
                                ) : (
                                  sets.map((set) => {
                                    const setActive =
                                      pathname === `/sets/${set.id}`;
                                    return (
                                      <SetMenuItem
                                        key={set.id}
                                        set={set}
                                        isActive={setActive}
                                      />
                                    );
                                  })
                                )}
                              </SidebarMenuSub>
                            </ScrollArea>
                          </div>
                        </motion.div>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.href}>
                      <div className="relative">
                        {active && !item.disabled && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                        )}
                        {item.disabled ? (
                          <div
                            className={cn(
                              "w-full h-auto py-2 px-3 rounded-md flex items-center gap-3 opacity-50 cursor-not-allowed"
                            )}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium text-sm">
                              {item.name}
                            </span>
                          </div>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            className={cn(
                              "w-full h-auto py-2 px-3 hover:bg-sidebar-accent",
                              active &&
                                "bg-[var(--color-sidebar-accent-active)] hover:bg-[var(--color-sidebar-accent-active)]"
                            )}
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 w-full"
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium text-sm">
                                {item.name}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions */}
          <SidebarGroup className="my-6">
            <SidebarGroupLabel className="py-2 mb-2 font-mono">
              Hurtige Handlinger
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 flex flex-col gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  if (action.action === "create-card") {
                    return (
                      <Button
                        key={`${action.name}-${index}`}
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setCreateCardDialogOpen(true)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={`${action.href}-${index}`}
                      asChild
                      size="sm"
                      variant={index === 0 ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      <Link href={action.href}>
                        <Icon className="w-4 h-4 mr-2" />
                        {action.name}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-3">
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      {/* Create Card Dialog */}
      <FlashcardDialog
        open={createCardDialogOpen}
        onOpenChange={setCreateCardDialogOpen}
        mode="select-set"
      />

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Main Content */}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-2" />
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="relative h-9 w-full max-w-sm justify-start gap-2 text-sm text-muted-foreground bg-background hover:bg-accent/50 border-border/60"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline-flex flex-1 text-left">
              Søg sæt eller navigation...
            </span>
            <Kbd className="hidden md:inline-flex ml-auto">⌘K</Kbd>
          </Button>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
