"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/modules/components/ui/command";
import { useSets } from "@/modules/data/client/hooks/queries/useSets.client";
import { Home, Layers, Library } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { sets, isLoading } = useSets();
  const [search, setSearch] = useState("");

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSearch("");
      }, 0);
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
      label: "Flashcard Sets",
      icon: Library,
      onSelect: () => router.push("/sets"),
    },
  ];

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Palette"
      description="Quick navigation"
    >
      <CommandInput
        placeholder="Search sets or navigation..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

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

        {(isLoading || sets.length > 0) && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Flashcard Sets">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CommandItem key={i} disabled>
                      <div className="h-4 w-4 mr-2 bg-muted rounded animate-pulse" />
                      <div className="h-4 flex-1 bg-muted rounded animate-pulse" />
                    </CommandItem>
                  ))
                : sets.map((set) => (
                    <CommandItem
                      key={set.id}
                      onSelect={() =>
                        handleSelect(() => router.push(`/sets/${set.id}`))
                      }
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      <span className="flex-1">{set.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {set.cardCount || 0} cards
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
