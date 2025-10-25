"use client";

import { useState } from "react";

interface SearchFilterProps<T> {
  items: T[];
  onFiltered: (items: T[]) => void;
  searchKey?: keyof T;
  placeholder?: string;
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
}: SearchFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value) {
      onFiltered(items);
    } else {
      const filtered = items.filter((item) =>
        String(item[searchKey])?.toLowerCase().includes(value.toLowerCase())
      );
      onFiltered(filtered);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
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
