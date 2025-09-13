"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { StudyInterface } from "@/modules/components/study/study-interface";
import { StudyModeSelector, type StudyMode } from "@/modules/components/study/study-mode-selector";
import { useFlashcardsBySet } from "@/modules/hooks/use-flashcards";
import { useSets } from "@/modules/hooks/use-sets";
import { Card, CardContent } from "@/modules/components/ui/card";
import { getStudyStats, getDueCards, sortCardsByPriority } from "@/modules/lib/spaced-repetition";
import type { Flashcard } from "@/modules/types";
import Link from "next/link";

export default function StudyPage() {
  const params = useParams();
  const setName = decodeURIComponent(params['set-name'] as string);
  const [selectedMode, setSelectedMode] = useState<StudyMode | null>(null);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);

  const { flashcards, loading, error } = useFlashcardsBySet(setName);
  const { sets, loading: setsLoading } = useSets();

  if (loading || setsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Henter flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
              <Link
                href="/sets"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Tilbage til sets
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                Ingen flashcards fundet i dette set
              </div>
              <Link
                href="/sets"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Tilbage til sets
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSet = sets.find(set => set.name === setName);
  const setDifficulty = currentSet?.difficulty || 3;
  const studyStats = getStudyStats(flashcards);

  const handleModeSelection = (mode: StudyMode) => {
    let filteredCards: Flashcard[] = [];

    switch (mode) {
      case 'new':
        filteredCards = flashcards.filter(card => !card.performance);
        break;
      case 'review':
        filteredCards = flashcards.filter(card => card.performance);
        break;
      case 'due-only':
        filteredCards = getDueCards(flashcards);
        break;
      case 'mixed':
      default:
        filteredCards = flashcards;
        break;
    }

    // Sort cards by priority for better learning experience
    const sortedCards = sortCardsByPriority(filteredCards);
    setStudyCards(sortedCards);
    setSelectedMode(mode);
  };

  // Show mode selector if no mode is selected
  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <StudyModeSelector
            studyStats={studyStats}
            onSelectMode={handleModeSelection}
          />
        </div>
      </div>
    );
  }

  return (
    <StudyInterface 
      flashcards={studyCards} 
      setName={setName}
      setDifficulty={setDifficulty}
      studyMode={selectedMode}
      onModeChange={() => setSelectedMode(null)}
    />
  );
}