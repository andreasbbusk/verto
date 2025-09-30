/**
 * Simple Spaced Repetition Algorithm
 * Based on SuperMemo SM-2 algorithm with simplifications
 */

export interface CardPerformance {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReviewed: Date;
}

export interface ReviewResult {
  correct: boolean;
  difficulty: number; // 1-5 scale from difficulty rating
  responseTime: number; // in milliseconds
}

/**
 * Calculate the next review interval and ease factor based on performance
 */
export function calculateNextReview(
  currentPerformance: Partial<CardPerformance>,
  reviewResult: ReviewResult
): CardPerformance {
  const {
    easeFactor = 2.5,
    interval = 1,
    repetitions = 0
  } = currentPerformance;

  const now = new Date();
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  // Map difficulty rating (1-5) to quality factor (0-5)
  // Lower difficulty = higher quality = better performance
  const quality = 6 - reviewResult.difficulty;

  // Update ease factor based on quality of response
  if (quality < 3) {
    // Poor response (difficulty 4-5), reset interval and repetitions
    newRepetitions = 0;
    newInterval = 1;
  } else {
    // Good response (difficulty 1-3)
    newEaseFactor = Math.max(
      1.3,
      newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }

    newRepetitions += 1;
  }

  // Adjust interval based on response time
  const averageResponseTime = 5000; // 5 seconds baseline
  const responseTimeMultiplier = Math.min(2, Math.max(0.5, averageResponseTime / reviewResult.responseTime));
  newInterval = Math.round(newInterval * responseTimeMultiplier);

  // Calculate next review date
  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    lastReviewed: now
  };
}

/**
 * Determine if a card is due for review
 */
export function isCardDue(performance: CardPerformance): boolean {
  return new Date() >= performance.nextReview;
}

/**
 * Get cards that are due for review
 */
export function getDueCards<T extends { id: string | number; performance?: CardPerformance }>(
  cards: T[]
): T[] {
  return cards.filter(card => {
    if (!card.performance) return true; // New cards are always due
    return isCardDue(card.performance);
  });
}

/**
 * Sort cards by review priority
 * Priority: overdue cards first, then by ease factor (difficult cards first)
 */
export function sortCardsByPriority<T extends { id: string | number; performance?: CardPerformance }>(
  cards: T[]
): T[] {
  return [...cards].sort((a, b) => {
    const aPerf = a.performance;
    const bPerf = b.performance;

    // New cards (no performance) go first
    if (!aPerf && !bPerf) return 0;
    if (!aPerf) return -1;
    if (!bPerf) return 1;

    const now = new Date();
    const aDaysOverdue = Math.max(0, (now.getTime() - aPerf.nextReview.getTime()) / (24 * 60 * 60 * 1000));
    const bDaysOverdue = Math.max(0, (now.getTime() - bPerf.nextReview.getTime()) / (24 * 60 * 60 * 1000));

    // Overdue cards first
    if (aDaysOverdue > 0 && bDaysOverdue === 0) return -1;
    if (bDaysOverdue > 0 && aDaysOverdue === 0) return 1;

    // Among overdue cards, most overdue first
    if (aDaysOverdue > 0 && bDaysOverdue > 0) {
      return bDaysOverdue - aDaysOverdue;
    }

    // Among due cards, lower ease factor (more difficult) first
    return aPerf.easeFactor - bPerf.easeFactor;
  });
}

/**
 * Get study statistics for a set of cards
 */
export function getStudyStats<T extends { id: string | number; performance?: CardPerformance }>(
  cards: T[]
): {
  totalCards: number;
  newCards: number;
  reviewCards: number;
  dueCards: number;
  overdueCards: number;
  averageEaseFactor: number;
} {
  const totalCards = cards.length;
  let newCards = 0;
  let reviewCards = 0;
  let dueCards = 0;
  let overdueCards = 0;
  let easeFactorSum = 0;

  const now = new Date();

  cards.forEach(card => {
    if (!card.performance) {
      newCards++;
      dueCards++;
    } else {
      reviewCards++;
      easeFactorSum += card.performance.easeFactor;

      if (isCardDue(card.performance)) {
        dueCards++;
        
        const daysOverdue = (now.getTime() - card.performance.nextReview.getTime()) / (24 * 60 * 60 * 1000);
        if (daysOverdue > 1) {
          overdueCards++;
        }
      }
    }
  });

  return {
    totalCards,
    newCards,
    reviewCards,
    dueCards,
    overdueCards,
    averageEaseFactor: reviewCards > 0 ? easeFactorSum / reviewCards : 2.5
  };
}