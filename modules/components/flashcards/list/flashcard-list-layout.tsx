"use client";

import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { SearchFilter } from "@/modules/components/ui/search-filter";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { BookOpen, PlusCircle } from "lucide-react";
import type { FlashcardListState } from "./use-flashcard-list-state";

type FlashcardListLayoutContextValue = {
  state: FlashcardListState;
  onCreate?: () => void;
};

const FlashcardListLayoutContext =
  createContext<FlashcardListLayoutContextValue | null>(null);

function useFlashcardListLayout() {
  const context = useContext(FlashcardListLayoutContext);

  if (!context) {
    throw new Error("FlashcardListLayout components must be used within FlashcardListLayout.");
  }

  return context;
}

interface FlashcardListLayoutProps {
  state: FlashcardListState;
  onCreate?: () => void;
  children: ReactNode;
}

function FlashcardListToolbar({ children }: { children?: ReactNode }) {
  const { state } = useFlashcardListLayout();
  const { activeFilter, setActiveFilter, searchTerm, setSearchTerm, setFilteredCards, filteredByType } =
    state;

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All cards
        </Button>
        <Button
          variant={activeFilter === "starred" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveFilter("starred")}
        >
          Starred cards
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchFilter
            items={filteredByType}
            onFiltered={setFilteredCards}
            searchKey="front"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <div className="flex items-center gap-2">{children}</div>
      </div>
    </>
  );
}

function FlashcardListContent({ children }: { children: ReactNode }) {
  const { state, onCreate } = useFlashcardListLayout();
  const {
    hasNoFlashcards,
    hasNoFilterMatches,
    hasNoSearchMatches,
    setActiveFilter,
  } = state;

  if (hasNoFlashcards) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-lg text-foreground mb-2">
              No flashcards
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your first flashcard to this set
            </p>
          </div>
          {onCreate && (
            <Button onClick={onCreate} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Flashcard
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (hasNoFilterMatches) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-lg text-foreground mb-2">
              No cards match the filter
            </h3>
            <p className="text-muted-foreground text-sm">
              Try another filter or add more flashcards
            </p>
          </div>
          <Button onClick={() => setActiveFilter("all")} variant="outline" size="sm">
            Show all cards
          </Button>
        </div>
      </Card>
    );
  }

  if (hasNoSearchMatches) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No flashcards match your search</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>;
}

type FlashcardListLayoutComponent = ((
  props: FlashcardListLayoutProps,
) => ReactElement) & {
  Toolbar: typeof FlashcardListToolbar;
  Content: typeof FlashcardListContent;
};

const FlashcardListLayout = (({ state, onCreate, children }: FlashcardListLayoutProps) => {
  const value = useMemo(
    () => ({ state, onCreate }),
    [onCreate, state],
  );

  return (
    <FlashcardListLayoutContext.Provider value={value}>
      <div className="space-y-6">{children}</div>
    </FlashcardListLayoutContext.Provider>
  );
}) as FlashcardListLayoutComponent;

FlashcardListLayout.Toolbar = FlashcardListToolbar;
FlashcardListLayout.Content = FlashcardListContent;

export { FlashcardListLayout, FlashcardListToolbar, FlashcardListContent };
export type { FlashcardListLayoutProps };
