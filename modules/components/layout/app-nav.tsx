"use client";

import { Button } from "@/modules/components/ui/button";
import { Kbd } from "@/modules/components/ui/kbd";
import { VertoLogo } from "@/modules/components/ui/logo";
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
  SidebarSeparator,
} from "@/modules/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/components/ui/tooltip";
import {
  usePrefetchSetById,
  useSets,
} from "@/modules/data/client/hooks/queries/useSets.client";
import { cn } from "@/modules/lib/utils";
import { useStudyProgressStore } from "@/modules/stores/study-progress.store";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Home,
  Library,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CommandPalette } from "./command-palette";
import { UserMenu } from "./user-menu";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Flashcard Sets",
    href: "/sets",
    icon: Library,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    disabled: true,
  },
];

interface AppNavigationProps {
  children: React.ReactNode;
}

function SetMenuItem({ set, isActive }: { set: any; isActive: boolean }) {
  const prefetchSetById = usePrefetchSetById();
  const MAX_LENGTH = 20;
  const isTruncated = set.name.length > MAX_LENGTH;
  const displayName = isTruncated
    ? `${set.name.slice(0, MAX_LENGTH)}...`
    : set.name;

  const handlePrefetch = () => prefetchSetById(set.id);

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
                className="flex items-ce1nter gap-2 w-full min-w-0"
                onMouseEnter={handlePrefetch}
              >
                <span className="text-xs text-sidebar-foreground/70 w-6 flex-shrink-0 ml-1">
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
  const prefetchSetById = usePrefetchSetById();
  const studyProgress = useStudyProgressStore((state) => state.progress);
  const [setsExpanded, setSetsExpanded] = useState(true);
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

  const recentSets = useMemo(() => {
    if (sets.length === 0) return [];

    const setMap = new Map(sets.map((set) => [set.id, set]));

    return Object.entries(studyProgress)
      .map(([setId, progress]) => ({ setId, ...progress }))
      .filter((entry) => setMap.has(entry.setId))
      .sort(
        (a, b) =>
          new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime()
      )
      .slice(0, 6)
      .map((entry) => ({
        set: setMap.get(entry.setId)!,
        lastStudied: entry.lastStudied,
      }));
  }, [sets, studyProgress]);

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
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-3 text-sidebar-foreground">
              <VertoLogo
                size="lg"
                className="text-sidebar-foreground"
                textClassName="text-xl font-semibold font-mono"
                iconClassName="text-foreground"
              />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="mx-0 bg-sidebar-border" />

        {/* Sidebar Content */}
        <SidebarContent className="py-4 overflow-x-hidden">
          <SidebarGroup className="px-4">
            <SidebarGroupContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandPaletteOpen(true)}
                className="h-10 w-full justify-start gap-2 text-sidebar-foreground/70 bg-sidebar hover:bg-sidebar-accent hover:text-sidebar-foreground border-sidebar-border"
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">Search...</span>
                <Kbd className="hidden md:inline-flex ml-auto">⌘K</Kbd>
              </Button>
              <Button asChild size="sm" className="w-full justify-start">
                <Link href="/sets?create=true">
                  <Plus className="h-4 w-4 mr-2" />
                  New set
                </Link>
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-3 bg-sidebar-border" />

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 mb-2 font-mono text-md">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-3 gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  // Special handling for Flashcard Sets with dropdown
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
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className="h-6 bg-sidebar-accent/50 rounded animate-pulse"
                                      />
                                    ))}
                                  </div>
                                ) : sets.length === 0 ? (
                                  <p className="px-3 py-2 text-xs text-sidebar-foreground/70">
                                    No sets yet
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

          <SidebarSeparator className="mx-3 bg-sidebar-border" />

          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 mb-2 font-mono text-md">
              Recents
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {recentSets.length === 0 ? (
                <p className="px-4 py-2 text-xs text-sidebar-foreground/70">
                  No recent sets yet
                </p>
              ) : (
                <SidebarMenu className="px-3 gap-1">
                  {recentSets.map(({ set }) => (
                    <SidebarMenuItem key={set.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(`/sets/${set.id}`)}
                        className={cn(
                          "w-full h-auto py-2 px-3 hover:bg-sidebar-accent",
                          isActive(`/sets/${set.id}`) &&
                            "bg-[var(--color-sidebar-accent-active)] hover:bg-[var(--color-sidebar-accent-active)]"
                        )}
                      >
                        <Link
                          href={`/sets/${set.id}`}
                          className="flex items-center"
                          onMouseEnter={() => prefetchSetById(set.id)}
                        >
                          <span className="text-sm font-medium truncate">
                            {set.name}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="p-3">
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      {/* Main Content */}
      <SidebarInset>
        <div className="relative flex-1">
          <div className="flex-1 p-6 pt-8">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
