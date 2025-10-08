"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/stores/authStore";
import { Button } from "@/modules/components/ui/button";
import { Avatar } from "@/modules/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/components/ui/popover";
import { Settings, LogOut, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Du er nu logget ud");
      router.push("/");
    } catch (error) {
      toast.error("Fejl ved logout");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between flex gap-3 px-3 py-5 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <div className="flex items-center justify-center w-full h-full bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <span className="text-sm font-medium text-foreground truncate">
              {user.name}
            </span>
          </div>
          <div>
            <EllipsisVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
              <span>Indstillinger</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 h-auto font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log ud</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
