"use client";

import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";

interface StudyEmptyStateProps {
  filterStarredOnly: boolean;
  onShowAll?: () => void;
}

export function StudyEmptyState({
  filterStarredOnly,
  onShowAll,
}: StudyEmptyStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {filterStarredOnly ? "No starred flashcards" : "No flashcards"}
              </h3>
              <p className="text-muted-foreground">
                {filterStarredOnly
                  ? "No cards are marked as favorites yet"
                  : "This set contains no cards to study"}
              </p>
            </div>
            {filterStarredOnly && onShowAll && (
              <Button variant="outline" onClick={onShowAll}>
                Show all cards
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export type { StudyEmptyStateProps };
