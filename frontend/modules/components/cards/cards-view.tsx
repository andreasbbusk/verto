"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { FlashcardList } from "@/modules/components/flashcards/flashcard-list";
import { FlashcardForm } from "@/modules/components/flashcards/flashcard-form";
import { useFlashcards } from "@/modules/hooks/use-flashcards";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { ArrowLeft, PlusCircle, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Flashcard, CreateFlashcardData, UpdateFlashcardData } from "@/modules/types";

export function CardsView() {
  const { flashcards, loading, error, refresh, create, update, remove } = useFlashcards();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: CreateFlashcardData) => {
    try {
      setIsSubmitting(true);
      await create(data);
      setIsCreating(false);
      toast.success("Flashcard oprettet!");
    } catch (error) {
      toast.error("Kunne ikke oprette flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateFlashcardData) => {
    if (!editingCard) return;
    
    try {
      setIsSubmitting(true);
      await update(editingCard.id.toString(), data);
      setEditingCard(null);
      toast.success("Flashcard opdateret!");
    } catch (error) {
      toast.error("Kunne ikke opdatere flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: CreateFlashcardData | UpdateFlashcardData) => {
    if (editingCard) {
      await handleUpdate(data as UpdateFlashcardData);
    } else {
      await handleCreate(data as CreateFlashcardData);
    }
  };

  const handleDelete = async (flashcard: Flashcard) => {
    try {
      await remove(flashcard.id.toString());
      toast.success("Flashcard slettet!");
    } catch (error) {
      toast.error("Kunne ikke slette flashcard");
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCard(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Indlæser flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tilbage til dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Mine Flashcards
              </h1>
              <p className="text-gray-600 mt-1">
                Administrer alle dine flashcards på ét sted
              </p>
            </div>
          </div>
          {!isCreating && !editingCard && (
            <Button onClick={() => setIsCreating(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nyt Flashcard
            </Button>
          )}
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
                  <p className="text-sm font-medium text-gray-600">Total Kort</p>
                  <p className="text-2xl font-bold text-gray-900">{flashcards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Unikke Sets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(flashcards.map(card => card.set)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
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

      {/* Form */}
      {(isCreating || editingCard) && (
        <AnimatedSection delay={0.2}>
          <FlashcardForm
            flashcard={editingCard || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </AnimatedSection>
      )}

      {/* Content */}
      <AnimatedSection delay={0.3}>
        {error ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-red-600 font-medium mb-2">{error}</div>
                <p className="text-gray-500 text-sm mb-4">
                  Prøv at genindlæse siden
                </p>
                <Button onClick={refresh} variant="outline">
                  Genindlæs
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <FlashcardList
            flashcards={flashcards}
            onEdit={handleEdit}
            onDelete={handleDelete}
            groupBySet={true}
          />
        )}
      </AnimatedSection>
    </div>
  );
}