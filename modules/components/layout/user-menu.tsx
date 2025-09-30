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
import { Separator } from "@/modules/components/ui/separator";
import { Settings, LogOut, ChevronDown } from "lucide-react";
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
          variant="ghost"
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Avatar className="h-10 w-10">
            <div className="flex items-center justify-center w-full h-full bg-blue-600 text-white text-sm font-medium rounded-full">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div className="flex-1 flex flex-col items-start min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate w-full">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 truncate w-full">
              {user.email}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="start" side="right">
        <div className="space-y-2">
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2"
              asChild
            >
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Indstillinger</span>
              </Link>
            </Button>
          </div>
          <Separator />
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 text-red-600 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log ud</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
