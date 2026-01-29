"use client";

import { useEffect, useState } from "react";

interface SearchFilterProps<T> {
  items: T[];
  onFiltered: (items: T[]) => void;
  searchKey?: keyof T;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Generic search filter component for filtering arrays of objects
 * Filters based on a specified key and calls onFiltered with results
 */
export function SearchFilter<T extends Record<string, any>>({
  items,
  onFiltered,
  searchKey = "name" as keyof T,
  placeholder = "Search...",
  value,
  onChange,
}: SearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const effectiveValue = value ?? searchTerm;

  useEffect(() => {
    if (!effectiveValue) {
      onFiltered(items);
      return;
    }

    const filtered = items.filter((item) =>
      String(item[searchKey])?.toLowerCase().includes(effectiveValue.toLowerCase())
    );
    onFiltered(filtered);
  }, [effectiveValue, items, onFiltered, searchKey]);

  const handleSearch = (nextValue: string) => {
    if (value === undefined) {
      setSearchTerm(nextValue);
    }
    onChange?.(nextValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={effectiveValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-1 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-300 box-border focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
