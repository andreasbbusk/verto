'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import FlashcardComponent from '@/modules/components/flashcards/flashcard';
import { ProgressBar } from './progress-bar';
import { StudyControls } from './study-controls';
import { Card, CardContent } from '@/modules/components/ui/card';
import type { Flashcard } from '@/modules/types';

interface StudyInterfaceProps {
  flashcards: Flashcard[];
  setName: string;
  onFlashcardUpdate?: (flashcard: Flashcard) => void;
}

export function StudyInterface({ flashcards, setName, onFlashcardUpdate }: StudyInterfaceProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [studyCards, setStudyCards] = useState(flashcards);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlayEnabled || studyCards.length <= 1) return;

    const interval = setInterval(() => {
      if (isFlipped) {
        // Move to next card after showing back
        goToNext();
      } else {
        // Flip to back after showing front
        setIsFlipped(true);
      }
    }, 3000); // 3 seconds per side

    return () => clearInterval(interval);
  }, [autoPlayEnabled, isFlipped, currentIndex, studyCards.length]);

  const goToNext = useCallback(() => {
    if (studyCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % studyCards.length);
      setIsFlipped(false);
    }
  }, [studyCards.length]);

  const goToPrevious = useCallback(() => {
    if (studyCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + studyCards.length) % studyCards.length);
      setIsFlipped(false);
    }
  }, [studyCards.length]);

  const jumpToCard = useCallback((index: number) => {
    if (index >= 0 && index < studyCards.length) {
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  }, [studyCards.length]);

  const shuffleCards = useCallback(() => {
    const shuffled = [...studyCards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [studyCards]);

  const resetStudy = useCallback(() => {
    setStudyCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAutoPlayEnabled(false);
  }, [flashcards]);

  const exitStudy = useCallback(() => {
    router.push('/sets');
  }, [router]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        exitStudy();
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetStudy();
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        shuffleCards();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, exitStudy, resetStudy, shuffleCards]);

  if (studyCards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-gray-400 text-4xl">📚</div>
              <div>
                <h3 className="font-semibold text-lg">Ingen flashcards</h3>
                <p className="text-gray-500">
                  Dette set indeholder ingen kort at studere
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = studyCards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{setName}</h1>
          <ProgressBar
            current={currentIndex}
            total={studyCards.length}
            onProgressClick={jumpToCard}
          />
        </div>

        {/* Flashcard */}
        <div className="flex justify-center">
          <FlashcardComponent
            flashcard={currentCard}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
            className="w-full max-w-md"
          />
        </div>

        {/* Controls */}
        <StudyControls
          currentIndex={currentIndex}
          totalCards={studyCards.length}
          isFlipped={isFlipped}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onFlip={() => setIsFlipped(prev => !prev)}
          onReset={resetStudy}
          onExit={exitStudy}
          onShuffle={shuffleCards}
          autoPlayEnabled={autoPlayEnabled}
          onToggleAutoPlay={() => setAutoPlayEnabled(prev => !prev)}
        />

        {/* Study Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>Fremskridt: {Math.round(((currentIndex + 1) / studyCards.length) * 100)}%</span>
                <span>Kort tilbage: {studyCards.length - currentIndex - 1}</span>
              </div>
              <div className="flex items-center gap-4">
                {autoPlayEnabled && (
                  <span className="text-blue-600 font-medium">🔄 Auto-afspilning aktiv</span>
                )}
                <span>Total: {studyCards.length} kort</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}