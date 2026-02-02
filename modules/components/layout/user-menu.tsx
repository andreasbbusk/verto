"use client";

import { getUser, signOut } from "@/modules/server/actions/auth";
import { Avatar } from "@/modules/components/ui/avatar";
import { Button } from "@/modules/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/components/ui/popover";
import type { User } from "@supabase/supabase-js";
import { EllipsisVertical, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    getUser().then((user) => {
      if (isMounted) {
        setUser(user);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      if (error instanceof Error && !error.message.includes("NEXT_REDIRECT")) {
        toast.error("Error during logout");
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between flex gap-3 px-3 py-5 rounded-xl transition-colors text-sidebar-foreground border-sidebar-border bg-sidebar hover:bg-sidebar-accent hover:translate-y-0"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                {user.user_metadata?.name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
            </Avatar>
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {user.user_metadata?.name || user.email}
            </span>
          </div>
          <div>
            <EllipsisVertical className="h-4 w-4 text-sidebar-foreground/70 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start" side="top">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto font-normal"
            asChild
          >
            <Link href="/settings" className="flex items-center gap-3">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
