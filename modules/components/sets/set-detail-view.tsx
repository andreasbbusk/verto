"use client";

import { FlashcardDialog } from "@/modules/components/flashcards/flashcard-dialog";
import { FlashcardList } from "@/modules/components/flashcards/flashcard-list";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import type {
  CreateFlashcardData,
  CreateSetData,
  Flashcard,
  UpdateFlashcardData
} from "@/modules/types";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  Play,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { SetDialog } from "./set-dialog";
import { useSetById, useSets } from "@/modules/hooks/use-sets";
import { useFlashcardMutations } from "@/modules/hooks/use-flashcards";

interface SetDetailViewProps {
  id: number;
}

export function SetDetailView({ id }: SetDetailViewProps) {
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const router = useRouter();

  const { set, flashcards, loading, error } = useSetById(id);
  const flashcardMutations = useFlashcardMutations(id);

  const { update: updateSet, remove: removeSet } = useSets();

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

    if (!confirm(`Er du sikker på du vil slette set "${set.name}" og alle dets flashcards?`)) {
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

  const handleEditCard = (flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setCardDialogOpen(true);
  };

  const handleCardDialogChange = (open: boolean) => {
    setCardDialogOpen(open);
    if (!open) {
      setEditingCard(null);
    }
  };

  const handleCardFormSubmit = async (data: CreateFlashcardData | UpdateFlashcardData) => {
    if (editingCard) {
      await handleUpdateCard(data as UpdateFlashcardData);
    } else {
      await handleCreateCard(data as CreateFlashcardData);
    }
  };


  if (error || !set) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/sets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbage til sets
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-red-600 font-medium mb-2">
                {error || "Set ikke fundet"}
              </div>
              <p className="text-gray-500 text-sm mb-4">
                Settet eksisterer ikke eller du har ikke adgang til det
              </p>
              <Link href="/sets">
                <Button variant="outline">
                  Tilbage til sets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/sets">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbage til sets
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {set.name}
              </h1>
              <p className="text-gray-600 mt-1">
                {set.description || "Administrer flashcards i dette set"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/study/${set.id}`}>
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Start Studie
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => setCardDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Tilføj Kort
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Statistics */}
      <AnimatedSection delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Antal Kort</p>
                  <p className="text-2xl font-bold text-gray-900">{flashcards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Oprettet</p>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(set.createdAt).toLocaleDateString("da-DK")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {flashcards.reduce((sum, card) => sum + card.reviewCount, 0)}
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
        isLoading={flashcardMutations.isCreating || flashcardMutations.isUpdating}
      />

      {/* Flashcards */}
      <AnimatedSection delay={0.3}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Flashcards</h2>
            <Badge variant="secondary">{flashcards.length} kort</Badge>
          </div>
          
          {flashcards.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Ingen flashcards</h3>
                    <p className="text-gray-500">
                      Tilføj dit første flashcard til dette set
                    </p>
                  </div>
                  <Button onClick={() => setCardDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Tilføj Flashcard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <FlashcardList
              flashcards={flashcards}
              onEdit={handleEditCard}
              onDelete={handleDeleteCard}
            />
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}