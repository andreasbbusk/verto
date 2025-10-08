import { Card, CardContent, CardFooter, CardHeader } from "@/modules/components/ui/card";
import { Skeleton } from "@/modules/components/ui/skeleton";

export function SetCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-3/4" />
          </div>
          <Skeleton className="w-10 h-10" />
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border">
        <div className="flex w-full gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-10" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function SetTableRowSkeleton() {
  return (
    <div className="border-b border-border px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="hidden md:block">
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="hidden sm:block">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SetsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SetCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SetsTableSkeleton() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20 hidden md:block" />
          <Skeleton className="h-4 w-20 hidden sm:block" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <SetTableRowSkeleton key={i} />
      ))}
    </div>
  );
}
