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
import { useSetDetailActions } from "@/modules/data/client/hooks/useSetDetailActions.client";
import { useSetById } from "@/modules/data/client/hooks/queries/useSets.client";
import type { Flashcard } from "@/modules/types/types";
import { ChevronDown, Play, PlusCircle } from "lucide-react";
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
    return flashcards.reduce((sum, card) => sum + card.reviewCount, 0);
  }, [flashcards]);

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
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
                {set.name}
              </h1>
              {set.difficulty && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-mono text-primary/60 bg-primary/10 px-2 py-1 rounded cursor-pointer">
                      {set.difficulty}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Difficulty: {set.difficulty}/5 - Indicates the difficulty
                      of flashcards in this set
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-muted-foreground mt-2 text-lg">
              {set.description || "Manage flashcards in this set"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/study/${set.id}`}>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Study
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleOpenCardDialog}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Card
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
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
        </div>
      </AnimatedSection>

      {/* Statistics */}
      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>
            <span className="text-foreground font-mono">
              {flashcards.length}
            </span>
            <span className="ml-1">cards</span>
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span>
            Created{" "}
            <span className="text-foreground font-mono">
              {new Date(set.createdAt).toLocaleDateString("en-US")}
            </span>
          </span>
          <span className="text-muted-foreground/60">·</span>
          <span>
            <span className="text-foreground font-mono">{totalReviews}</span>
            <span className="ml-1">reviews</span>
          </span>
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
