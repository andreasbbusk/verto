"use client";

import { FlashcardDialog } from "@/modules/components/flashcards/flashcard-dialog";
import { FlashcardList } from "@/modules/components/flashcards/flashcard-list";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { Breadcrumbs } from "@/modules/components/layout/breadcrumbs";
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/components/ui/dropdown-menu";
import { useFlashcardMutations } from "@/modules/hooks/use-flashcards";
import { useSetById, useSets } from "@/modules/hooks/use-sets";
import type {
  CreateFlashcardData,
  CreateSetData,
  Flashcard,
  UpdateFlashcardData,
} from "@/modules/types";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  Play,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SetDialog } from "./set-dialog";
import { Loader } from "@/modules/components/ui/loader";

interface SetDetailViewProps {
  id: number;
}

type FilterType = "all" | "starred" | "due";

export function SetDetailView({ id }: SetDetailViewProps) {
  const searchParams = useSearchParams();
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const router = useRouter();

  const { set, flashcards, isLoading, error } = useSetById(id);
  const flashcardMutations = useFlashcardMutations(id);

  const { update: updateSet, remove: removeSet } = useSets();

  // Filter flashcards based on active filter
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((card) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "starred") return card.starred;
      if (activeFilter === "due") {
        if (!card.performance?.nextReview) return false;
        return new Date(card.performance.nextReview) <= new Date();
      }
      return true;
    });
  }, [flashcards, activeFilter]);

  // Calculate counts for each filter
  const starredCount = useMemo(
    () => flashcards.filter((card) => card.starred).length,
    [flashcards]
  );
  const dueCount = useMemo(() => {
    return flashcards.filter((card) => {
      if (!card.performance?.nextReview) return false;
      return new Date(card.performance.nextReview) <= new Date();
    }).length;
  }, [flashcards]);

  // Check for createCard URL param and auto-open dialog
  useEffect(() => {
    if (searchParams.get("createCard") === "true") {
      setCardDialogOpen(true);
    }
  }, [searchParams]);

  const handleUpdateSet = async (data: CreateSetData) => {
    if (!set) return;

    try {
      await updateSet({ id: set.id, data });
    } catch (error) {
      toast.error("Kunne ikke opdatere set");
      throw error;
    }
  };

  const handleDeleteSet = async () => {
    if (!set) return;

    if (
      !confirm(
        `Er du sikker på du vil slette set "${set.name}" og alle dets flashcards?`
      )
    ) {
      return;
    }

    try {
      await removeSet(set.id);
      toast.success("Set slettet!");
      router.push("/sets");
    } catch (error) {
      toast.error("Kunne ikke slette set");
    }
  };

  const handleCreateCard = async (data: CreateFlashcardData) => {
    if (!set) return;

    try {
      await flashcardMutations.create(data);
    } catch (error) {
      // Error toast is handled in the mutation
      throw error;
    }
  };

  const handleBulkCreateCards = async (
    cards: Omit<CreateFlashcardData, "setId">[]
  ) => {
    if (!set) return;

    try {
      await flashcardMutations.createBulk(cards);
    } catch (error) {
      // Error toast is handled in the mutation
      throw error;
    }
  };

  const handleUpdateCard = async (data: UpdateFlashcardData) => {
    if (!editingCard) return;

    try {
      await flashcardMutations.update({ cardId: editingCard.id, data });
    } catch (error) {
      // Error toast is handled in the mutation
      throw error;
    }
  };

  const handleDeleteCard = async (flashcard: Flashcard) => {
    try {
      await flashcardMutations.remove(flashcard.id);
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleToggleStar = async (flashcard: Flashcard) => {
    try {
      await flashcardMutations.update({
        cardId: flashcard.id,
        data: { starred: !flashcard.starred },
      });
    } catch (error) {
      // Error toast is handled in the mutation
    }
  };

  const handleEditCard = (flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setCardDialogOpen(true);
  };

  const handleCardDialogChange = (open: boolean) => {
    setCardDialogOpen(open);
    if (!open) {
      // Delay clearing editingCard to prevent flickering during close animation
      setTimeout(() => {
        setEditingCard(null);
      }, 200);
    }
  };

  const handleCardFormSubmit = async (
    data: CreateFlashcardData | UpdateFlashcardData
  ) => {
    if (editingCard) {
      await handleUpdateCard(data as UpdateFlashcardData);
    } else {
      await handleCreateCard(data as CreateFlashcardData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !set) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Flashcard Sæt", href: "/sets" },
            { label: "Set ikke fundet" },
          ]}
        />

        <Card className="p-8">
          <div className="text-center">
            <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-4">
              <div className="text-destructive text-lg">!</div>
            </div>
            <div className="text-destructive font-mono text-sm mb-2">
              {error || "Set ikke fundet"}
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Settet eksisterer ikke eller du har ikke adgang til det
            </p>
            <Link href="/sets">
              <Button variant="outline" size="sm">
                Tilbage til sets
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
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Flashcard Sæt", href: "/sets" },
              { label: set.name },
            ]}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <div className="flex flex-col gap-3 mb-2">
              <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
                {set.name}
              </h1>
              <Badge variant="default" className="font-mono text-xs">
                Sværhedsgrad: {set.difficulty}/5
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 text-lg">
              {set.description || "Administrer flashcards i dette set"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/study/${set.id}`}>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Studie
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCardDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tilføj Kort
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Indstillinger
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSetDialogOpen(true)}>
                  Rediger Set
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteSet}
                  className="text-destructive"
                >
                  Slet Set
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AnimatedSection>

      {/* Statistics */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                    Antal Kort
                  </p>
                  <p className="text-2xl font-mono font-bold text-foreground">
                    {flashcards.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                    Oprettet
                  </p>
                  <p className="text-sm font-mono font-bold text-foreground">
                    {new Date(set.createdAt).toLocaleDateString("da-DK")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">
                    Total Reviews
                  </p>
                  <p className="text-2xl font-mono font-bold text-foreground">
                    {flashcards.reduce(
                      (sum, card) => sum + card.reviewCount,
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-mono font-bold text-foreground">
              Flashcards
            </h2>
            <Badge variant="secondary">
              {activeFilter === "all"
                ? `${flashcards.length} kort`
                : `${filteredFlashcards.length} af ${flashcards.length} kort`}
            </Badge>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              Alle ({flashcards.length})
            </Button>
            <Button
              variant={activeFilter === "starred" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("starred")}
            >
              Stjernet ({starredCount})
            </Button>
            <Button
              variant={activeFilter === "due" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("due")}
            >
              Til Gennemgang ({dueCount})
            </Button>
          </div>

          {flashcards.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg text-foreground mb-2">
                    Ingen flashcards
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Tilføj dit første flashcard til dette set
                  </p>
                </div>
                <Button onClick={() => setCardDialogOpen(true)} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tilføj Flashcard
                </Button>
              </div>
            </Card>
          ) : filteredFlashcards.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-lg text-foreground mb-2">
                    Ingen kort matcher filteret
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Prøv et andet filter eller tilføj flere flashcards
                  </p>
                </div>
                <Button
                  onClick={() => setActiveFilter("all")}
                  variant="outline"
                  size="sm"
                >
                  Vis Alle Kort
                </Button>
              </div>
            </Card>
          ) : (
            <FlashcardList
              flashcards={filteredFlashcards}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
              onToggleStar={handleToggleStar}
            />
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}
