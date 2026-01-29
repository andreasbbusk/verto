"use client";

import { FlashcardDialog } from "@/modules/components/flashcards/flashcard-dialog";
import { FlashcardList } from "@/modules/components/flashcards/flashcard-list";
import { AnimatedSection } from "@/modules/components/ui/animated-section";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/components/ui/tooltip";
import { useSetById } from "@/modules/data/client/hooks/queries/useSets.client";
import { useSetDetailActions } from "@/modules/data/client/hooks/useSetDetailActions.client";
import type { Flashcard } from "@/modules/types/types";
import { Calendar, ChevronDown, Layers, Play, PlusCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { SetDialog } from "./set-dialog";

interface SetDetailViewProps {
  setId: string;
}

export function SetDetailView({ setId }: SetDetailViewProps) {
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const handleOpenCardDialog = useCallback(() => {
    setCardDialogOpen(true);
  }, []);
  const { set, flashcards, error } = useSetById(setId);
  const {
    flashcardMutations,
    handleUpdateSet,
    handleDeleteSet,
    handleBulkCreateCards,
    handleCardFormSubmit,
    handleDeleteCard,
    handleToggleStar,
  } = useSetDetailActions({
    setId,
    set,
    editingCard,
    onOpenCreateCard: handleOpenCardDialog,
  });

  const totalReviews = useMemo(() => {
    if (typeof set?.totalReviews === "number") {
      return set.totalReviews;
    }
    return flashcards.reduce((sum, card) => sum + card.reviewCount, 0);
  }, [flashcards, set?.totalReviews]);

  const handleEditCard = useCallback((flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setCardDialogOpen(true);
  }, []);

  const handleCardDialogChange = useCallback((open: boolean) => {
    setCardDialogOpen(open);
    if (!open) {
      // Delay clearing editingCard to prevent flickering during close animation
      setTimeout(() => {
        setEditingCard(null);
      }, 200);
    }
  }, []);

  if (error || !set) {
    return (
      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center">
            <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-4">
              <div className="text-destructive text-lg">!</div>
            </div>
            <div className="text-destructive font-mono text-sm mb-2">
              {error || "Set not found"}
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              The set does not exist or you do not have access
            </p>
            <Link href="/sets">
              <Button variant="outline" size="sm">
                Back to sets
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedSection>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:gap-16 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
                  {set.name}
                </h1>
                {set.difficulty && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm font-mono text-amber-900 bg-amber-300/90 px-2 py-1 rounded cursor-pointer">
                        {set.difficulty}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Difficulty: {set.difficulty}/5 - Indicates the
                        difficulty of flashcards in this set
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="max-w-2xl text-muted-foreground text-base lg:text-lg">
                {set.description || "Manage flashcards in this set"}
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-border" />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.05}>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start sm:gap-3">
          <Link href={`/study/${set.id}`} className="w-full sm:w-auto">
            <Button size="sm" className="w-full sm:w-auto">
              <Play className="h-4 w-4 mr-2" />
              Start Study
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenCardDialog}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Card
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Settings
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSetDialogOpen(true)}>
                Edit Set
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteSet}
                className="text-destructive"
              >
                Delete Set
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </AnimatedSection>

      {/* Statistics */}
      <AnimatedSection delay={0.1}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="gap-4 border-foreground/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
                <Layers className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  Cards
                </div>
                <div className="text-2xl font-mono font-semibold text-foreground">
                  {flashcards.length}
                </div>
              </div>
            </div>
          </Card>
          <Card className="gap-4 border-foreground/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
                <Calendar className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  Created
                </div>
                <div className="text-lg font-mono font-semibold text-foreground">
                  {new Date(set.createdAt).toLocaleDateString("en-US")}
                </div>
              </div>
            </div>
          </Card>
          <Card className="gap-4 border-foreground/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
                <Sparkles className="h-4 w-4 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
                  Reviews
                </div>
                <div className="text-2xl font-mono font-semibold text-foreground">
                  {totalReviews}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </AnimatedSection>

      {/* Dialogs */}
      <SetDialog
        open={setDialogOpen}
        onOpenChange={setSetDialogOpen}
        set={set}
        onSubmit={handleUpdateSet}
        isLoading={flashcardMutations.isUpdating}
      />

      <FlashcardDialog
        open={cardDialogOpen}
        onOpenChange={handleCardDialogChange}
        flashcard={editingCard || undefined}
        onSubmit={handleCardFormSubmit}
        onBulkSubmit={handleBulkCreateCards}
        isLoading={
          flashcardMutations.isCreating ||
          flashcardMutations.isUpdating ||
          flashcardMutations.isCreatingBulk
        }
      />

      {/* Flashcards */}
      <AnimatedSection delay={0.2}>
        <FlashcardList
          flashcards={flashcards}
          onEdit={handleEditCard}
          onDelete={handleDeleteCard}
          onToggleStar={handleToggleStar}
          onCreate={handleOpenCardDialog}
        />
      </AnimatedSection>
    </div>
  );
}
