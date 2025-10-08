"use client";

import { SetsTableSkeleton } from "@/modules/components/sets/set-skeleton";
import { Skeleton } from "@/modules/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <SetsTableSkeleton />
    </div>
  );
}
