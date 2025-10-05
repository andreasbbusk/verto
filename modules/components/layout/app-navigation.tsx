"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/modules/components/ui/button";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/modules/components/ui/sidebar";
import { UserMenu } from "./user-menu";
import { cn } from "@/modules/lib/utils";
import {
  Home,
  Library,
  Calendar,
  Settings,
  GraduationCap,
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
    href: "/sets",
    icon: Plus,
  },
  {
    name: "Nyt Kort",
    href: "/cards",
    icon: BookOpen,
  },
];

interface AppNavigationProps {
  children: React.ReactNode;
}

export function AppNavigation({ children }: AppNavigationProps) {
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

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="border-subtle shadow-sm">
        {/* Sidebar Header */}
        <SidebarHeader className="border-b border-border px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
              <GraduationCap className="icon-md text-primary-foreground" />
            </div>
            <span className="text-heading-3 text-sidebar-primary">FlashCards</span>
          </Link>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="px-2 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2 gap-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-lg transition-colors duration-200",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 w-full"
                        >
                          <Icon className="icon-sm flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-body-sm leading-5">
                              {item.name}
                            </div>
                            <div
                              className={cn(
                                "text-xs leading-4 mt-0.5 normal-case tracking-normal",
                                active ? "text-primary-foreground/80" : "text-muted-foreground"
                              )}
                            >
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions */}
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="px-4 py-2">
              Hurtige Handlinger
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2 gap-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <SidebarMenuItem key={`${action.href}-${index}`}>
                      <SidebarMenuButton asChild>
                        <Link href={action.href}>
                          <Button
                            size="sm"
                            className={cn(
                              "w-full justify-start h-9 px-3 text-body-sm font-medium rounded-lg transition-all duration-200",
                              index === 0
                                ? "bg-primary hover:bg-primary/90 text-primary-foreground border-0"
                                : "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            )}
                          >
                            <Icon className="icon-sm mr-2" />
                            {action.name}
                          </Button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter className="border-t border-border p-3">
          <UserMenu />
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-border">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6 bg-gradient-soft">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
