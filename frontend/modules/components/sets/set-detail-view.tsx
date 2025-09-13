"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/components/ui/card";
import { Badge } from "@/modules/components/ui/badge";
import { FlashcardList } from "@/modules/components/flashcards/flashcard-list";
import { FlashcardForm } from "@/modules/components/flashcards/flashcard-form";
import { SetForm } from "./set-form";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { 
  getSets, 
  getFlashcardsBySet, 
  createFlashcard,
  updateFlashcard,
  deleteFlashcard
} from "@/modules/api";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2, 
  Play,
  PlusCircle,
  BookOpen,
  Calendar,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { 
  FlashcardSet, 
  Flashcard, 
  CreateFlashcardData, 
  UpdateFlashcardData,
  CreateSetData 
} from "@/modules/types";

interface SetDetailViewProps {
  id: string;
}

export function SetDetailView({ id }: SetDetailViewProps) {
  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Find set by name since we're using set name as ID in the URL
  useEffect(() => {
    const fetchSetData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all sets and find the one with matching name
        const allSets = await getSets();
        const decodedId = decodeURIComponent(id);
        const foundSet = allSets.find(s => s.name === decodedId);
        
        if (!foundSet) {
          setError("Set ikke fundet");
          return;
        }
        
        setSet(foundSet);
        
        // Get flashcards for this set
        const flashcardsData = await getFlashcardsBySet(foundSet.name);
        setFlashcards(flashcardsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kunne ikke hente set data");
      } finally {
        setLoading(false);
      }
    };

    fetchSetData();
  }, [id]);

  const handleUpdateSet = async (data: CreateSetData) => {
    if (!set) return;
    
    try {
      setIsSubmitting(true);
      // Since sets are derived from flashcards, we can't directly update a set
      // We would need to implement a different approach or show a message
      toast.info("Set opdatering er ikke implementeret endnu");
      setIsEditing(false);
    } catch (error) {
      toast.error("Kunne ikke opdatere set");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSet = async () => {
    if (!set) return;
    
    if (!confirm(`Er du sikker på du vil slette set "${set.name}" og alle dets flashcards?`)) {
      return;
    }

    try {
      // Delete all flashcards in the set
      await Promise.all(
        flashcards.map(card => deleteFlashcard(card.id.toString()))
      );
      toast.success("Set slettet!");
      router.push("/sets");
    } catch (error) {
      toast.error("Kunne ikke slette set");
    }
  };

  const handleCreateCard = async (data: CreateFlashcardData) => {
    if (!set) return;
    
    try {
      setIsSubmitting(true);
      const response = await createFlashcard({
        ...data,
        set: set.name, // Ensure the card is created in this set
      });
      setFlashcards(prev => [...prev, response.data]);
      setIsAddingCard(false);
      toast.success("Flashcard tilføjet!");
    } catch (error) {
      toast.error("Kunne ikke oprette flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCard = async (data: UpdateFlashcardData) => {
    if (!editingCard) return;
    
    try {
      setIsSubmitting(true);
      const response = await updateFlashcard(editingCard.id.toString(), data);
      setFlashcards(prev => 
        prev.map(card => card.id === editingCard.id ? response.data : card)
      );
      setEditingCard(null);
      toast.success("Flashcard opdateret!");
    } catch (error) {
      toast.error("Kunne ikke opdatere flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (flashcard: Flashcard) => {
    try {
      await deleteFlashcard(flashcard.id.toString());
      setFlashcards(prev => prev.filter(card => card.id !== flashcard.id));
      toast.success("Flashcard slettet!");
    } catch (error) {
      toast.error("Kunne ikke slette flashcard");
    }
  };

  const handleEditCard = (flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setIsAddingCard(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsAddingCard(false);
    setEditingCard(null);
  };

  const handleCardFormSubmit = async (data: CreateFlashcardData | UpdateFlashcardData) => {
    if (editingCard) {
      await handleUpdateCard(data as UpdateFlashcardData);
    } else {
      await handleCreateCard(data as CreateFlashcardData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Indlæser set...</p>
        </div>
      </div>
    );
  }

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
          {!isEditing && !isAddingCard && !editingCard && (
            <div className="flex gap-2">
              <Link href={`/study/${encodeURIComponent(set.name)}`}>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Start Studie
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingCard(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Tilføj Kort
              </Button>
            </div>
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

      {/* Forms */}
      {isEditing && (
        <AnimatedSection delay={0.2}>
          <SetForm
            set={set}
            onSubmit={handleUpdateSet}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </AnimatedSection>
      )}

      {(isAddingCard || editingCard) && (
        <AnimatedSection delay={0.2}>
          <FlashcardForm
            flashcard={editingCard || undefined}
            onSubmit={handleCardFormSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </AnimatedSection>
      )}

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
                  <Button onClick={() => setIsAddingCard(true)}>
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
              groupBySet={false}
            />
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}