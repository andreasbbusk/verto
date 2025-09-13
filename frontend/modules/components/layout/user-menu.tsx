"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/stores/authStore";
import { Button } from "@/modules/components/ui/button";
import { Avatar } from "@/modules/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/components/ui/dropdown-menu";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Indstillinger</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log ud</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
