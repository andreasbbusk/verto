"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Simple animation wrapper
export function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: AnimatedSectionProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

interface SearchFilterProps<T> {
  items: T[];
  onFiltered: (items: T[]) => void;
  searchKey?: keyof T;
  placeholder?: string;
}

// Search filter component
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

interface Item {
  id: string;
  name?: string;
  front?: string;
}

interface ActionButtonProps {
  item: Item;
  action: string;
  variant?: "default" | "destructive";
}

// Action buttons for CRUD operations
export function ActionButton({
  item,
  action,
  variant = "default",
}: ActionButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(`Er du sikker på du vil slette "${item.name || item.front}"?`)
    ) {
      return;
    }

    try {
      // TODO: Update this to use the new API structure with setId
      toast.info("Delete functionality needs to be updated");
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(
        error instanceof Error ? error.message : "Kunne ikke slette elementet."
      );
    }
  };

  const baseClasses = "px-3 py-1 rounded text-sm transition-colors";
  const variants = {
    default: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    destructive: "bg-red-100 hover:bg-red-200 text-red-700",
  };

  if (action === "Edit") {
    // ActionButton is only used for sets - flashcards use inline editing
    const editPath = `/sets/${item.id}/edit`; 

    return (
      <Link href={editPath}>
        <button className={`${baseClasses} ${variants[variant]}`}>
          Rediger
        </button>
      </Link>
    );
  }

  if (action === "Delete") {
    return (
      <button
        onClick={handleDelete}
        className={`${baseClasses} ${variants[variant]}`}
      >
        Slet
      </button>
    );
  }

  // Fallback for other actions
  return (
    <button
      onClick={() => toast.info(`${action} functionality coming soon.`)}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {action}
    </button>
  );
}
