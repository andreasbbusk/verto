"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/modules/components/ui/command";
import { useSets } from "@/modules/hooks/use-sets";
import {
  Home,
  Library,
  Calendar,
  BookOpen,
  Layers,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { sets } = useSets();
  const [search, setSearch] = useState("");

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const handleSelect = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  const navigationItems = [
    {
      label: "Dashboard",
      icon: Home,
      onSelect: () => router.push("/dashboard"),
    },
    {
      label: "Flashcard Sæt",
      icon: Library,
      onSelect: () => router.push("/sets"),
    },
    // Calendar is currently disabled
    // {
    //   label: "Kalender",
    //   icon: Calendar,
    //   onSelect: () => router.push("/calendar"),
    // },
  ];

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Hurtig navigation"
    >
      <CommandInput
        placeholder="Søg efter sæt eller navigation..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>Ingen resultater fundet.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.label}
                onSelect={() => handleSelect(item.onSelect)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {sets.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Flashcard Sæt">
              {sets.map((set) => (
                <CommandItem
                  key={set.id}
                  onSelect={() => handleSelect(() => router.push(`/sets/${set.id}`))}
                >
                  <Layers className="mr-2 h-4 w-4" />
                  <span className="flex-1">{set.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {set.cardCount || 0} kort
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
