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
      <Sidebar 
        variant="inset"
        className="border-r border-border shadow-sm"
      >
        {/* Sidebar Header */}
        <SidebarHeader className="border-b border-border px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-brand-purple rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              FlashCards
            </span>
          </Link>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="px-2 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={active}
                        className={cn(
                          "w-full flex items-start gap-3 px-3 py-3 rounded-lg text-sm transition-colors",
                          active
                            ? "bg-brand-purple text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-brand-purple"
                        )}
                      >
                        <Link href={item.href} className="flex items-start gap-3 w-full">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm leading-5">{item.name}</div>
                            <div className={cn(
                              "text-xs leading-4 mt-0.5",
                              active ? "text-white/80" : "text-gray-500"
                            )}>
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
            <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Hurtige Handlinger
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2 px-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;

                  return (
                    <SidebarMenuItem key={`${action.href}-${index}`}>
                      <SidebarMenuButton asChild>
                        <Link href={action.href}>
                          <Button
                            size="sm"
                            className={cn(
                              "w-full justify-start h-9 px-3 text-sm font-medium transition-all rounded-lg",
                              index === 0
                                ? "bg-brand-yellow hover:bg-brand-yellow/90 text-white border-0"
                                : "bg-transparent border border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
                            )}
                          >
                            <Icon className="h-4 w-4 mr-2" />
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
        <div className="flex-1 p-6 bg-gradient-soft">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
