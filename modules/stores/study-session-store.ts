import { create } from 'zustand';
import type { Flashcard } from '@/modules/types';

export interface CardReview {
  cardId: string | number;
  correct: boolean;
  difficulty: number;
  responseTime: number; // in milliseconds
  timestamp: Date;
}

export interface StudySession {
  id: string;
  setName: string;
  startTime: Date;
  endTime?: Date;
  cardsReviewed: CardReview[];
  totalCards: number;
  sessionType: 'review' | 'new' | 'mixed';
  isActive: boolean;
}

interface StudySessionStore {
  currentSession: StudySession | null;
  
  // Session management
  startSession: (setName: string, totalCards: number, sessionType: 'review' | 'new' | 'mixed') => void;
  endSession: () => StudySession | null;
  
  // Card review tracking
  recordCardReview: (cardId: string | number, correct: boolean, difficulty: number, responseTime: number) => void;
  
  // Session stats
  getSessionStats: () => {
    totalReviewed: number;
    correctAnswers: number;
    accuracy: number;
    averageResponseTime: number;
    averageDifficulty: number;
    timeSpent: number; // in minutes
  } | null;
  
  // Clear session
  clearSession: () => void;
}

export const useStudySessionStore = create<StudySessionStore>((set, get) => ({
  currentSession: null,
  
  startSession: (setName: string, totalCards: number, sessionType: 'review' | 'new' | 'mixed') => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      setName,
      startTime: new Date(),
      cardsReviewed: [],
      totalCards,
      sessionType,
      isActive: true,
    };
    set({ currentSession: session });
  },
  
  endSession: () => {
    const { currentSession } = get();
    if (!currentSession || !currentSession.isActive) return null;
    
    const completedSession = {
      ...currentSession,
      endTime: new Date(),
      isActive: false,
    };
    
    set({ currentSession: completedSession });
    return completedSession;
  },
  
  recordCardReview: (cardId: string | number, correct: boolean, difficulty: number, responseTime: number) => {
    const { currentSession } = get();
    if (!currentSession || !currentSession.isActive) return;
    
    const review: CardReview = {
      cardId,
      correct,
      difficulty,
      responseTime,
      timestamp: new Date(),
    };
    
    const updatedSession = {
      ...currentSession,
      cardsReviewed: [...currentSession.cardsReviewed, review],
    };
    
    set({ currentSession: updatedSession });
  },
  
  getSessionStats: () => {
    const { currentSession } = get();
    if (!currentSession || currentSession.cardsReviewed.length === 0) return null;
    
    const { cardsReviewed, startTime } = currentSession;
    const totalReviewed = cardsReviewed.length;
    const correctAnswers = cardsReviewed.filter(review => review.correct).length;
    const accuracy = totalReviewed > 0 ? (correctAnswers / totalReviewed) * 100 : 0;
    
    const totalResponseTime = cardsReviewed.reduce((sum, review) => sum + review.responseTime, 0);
    const averageResponseTime = totalReviewed > 0 ? totalResponseTime / totalReviewed : 0;
    
    const totalDifficulty = cardsReviewed.reduce((sum, review) => sum + review.difficulty, 0);
    const averageDifficulty = totalReviewed > 0 ? totalDifficulty / totalReviewed : 0;
    
    const endTime = currentSession.endTime || new Date();
    const timeSpent = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // in minutes
    
    return {
      totalReviewed,
      correctAnswers,
      accuracy,
      averageResponseTime,
      averageDifficulty,
      timeSpent,
    };
  },
  
  clearSession: () => {
    set({ currentSession: null });
  },
}));