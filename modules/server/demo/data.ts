import type { Flashcard, FlashcardSet, Profile, SetStats } from "@/modules/types/types";
import { DEMO_USER_ID } from "@/modules/server/demo/constants";

type DemoFlashcard = Flashcard & { tag: string };

const DEMO_CREATED_AT = "2026-01-02T00:00:00.000Z";
const DEMO_UPDATED_AT = "2026-03-04T00:00:00.000Z";

export const DEMO_PROFILE: Profile = {
  id: DEMO_USER_ID,
  email: "demo@verto.app",
  name: "Demo User",
  createdAt: DEMO_CREATED_AT,
  lastLogin: DEMO_UPDATED_AT,
  updatedAt: DEMO_UPDATED_AT,
  studyGoal: 20,
  theme: "system",
  notifications: false,
  stats: {
    totalStudySessions: 36,
    currentStreak: 4,
    longestStreak: 14,
    totalCardsStudied: 292,
    lastStudiedAt: "2026-03-03T00:00:00.000Z",
  },
};

const DEMO_SETS_BASE: FlashcardSet[] = [
  {
    id: "demo-set-memory",
    name: "Cognitive Psychology Essentials",
    description: "Core memory and cognition concepts.",
    difficulty: 3,
    starred: false,
    userId: DEMO_USER_ID,
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    cardCount: 12,
    stats: {
      totalReviews: 147,
      cardsStudied: 147,
      studySessions: 18,
      lastStudiedAt: "2026-03-03T00:00:00.000Z",
    },
  },
  {
    id: "demo-set-biology",
    name: "Cell Biology Crash Review",
    description: "Organelles, ATP cycle, and membrane transport.",
    difficulty: 4,
    starred: false,
    userId: DEMO_USER_ID,
    createdAt: "2026-01-14T00:00:00.000Z",
    updatedAt: "2026-02-25T00:00:00.000Z",
    cardCount: 22,
    stats: {
      totalReviews: 89,
      cardsStudied: 89,
      studySessions: 11,
      lastStudiedAt: "2026-02-25T00:00:00.000Z",
    },
  },
  {
    id: "demo-set-history",
    name: "European History Timeline",
    description: "High-impact events and cause/effect recall prompts.",
    difficulty: 2,
    starred: false,
    userId: DEMO_USER_ID,
    createdAt: "2026-01-28T00:00:00.000Z",
    updatedAt: "2026-02-20T00:00:00.000Z",
    cardCount: 16,
    stats: {
      totalReviews: 56,
      cardsStudied: 56,
      studySessions: 7,
      lastStudiedAt: "2026-02-20T00:00:00.000Z",
    },
  },
];

const DEMO_FLASHCARDS_BY_SET: Record<string, DemoFlashcard[]> = {
  "demo-set-memory": [
    makeFlashcard(
      "demo-card-memory-1",
      "demo-set-memory",
      "What is spaced repetition?",
      "A review strategy that increases the time between successful recalls.",
      "Memory",
      true,
    ),
    makeFlashcard(
      "demo-card-memory-2",
      "demo-set-memory",
      "Define retrieval practice.",
      "Actively recalling information from memory instead of rereading notes.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-3",
      "demo-set-memory",
      "What is cognitive load?",
      "The amount of working-memory effort used while processing information.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-4",
      "demo-set-memory",
      "What is the serial position effect?",
      "The tendency to recall first and last items best (primacy and recency).",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-5",
      "demo-set-memory",
      "Define working memory.",
      "A limited-capacity system for temporarily holding and manipulating information.",
      "Memory",
      true,
    ),
    makeFlashcard(
      "demo-card-memory-6",
      "demo-set-memory",
      "What is chunking in learning?",
      "Grouping small units into larger meaningful units to improve recall.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-7",
      "demo-set-memory",
      "What is encoding specificity?",
      "Recall improves when retrieval cues match the context present during encoding.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-8",
      "demo-set-memory",
      "What is proactive interference?",
      "Older memories interfere with learning or recalling newer information.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-9",
      "demo-set-memory",
      "What is retroactive interference?",
      "Newer information interferes with recall of older information.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-10",
      "demo-set-memory",
      "What does the spacing effect describe?",
      "Distributed study sessions lead to better long-term retention than cramming.",
      "Memory",
      true,
    ),
    makeFlashcard(
      "demo-card-memory-11",
      "demo-set-memory",
      "What is transfer-appropriate processing?",
      "Memory improves when study activities resemble the final retrieval demands.",
      "Memory",
    ),
    makeFlashcard(
      "demo-card-memory-12",
      "demo-set-memory",
      "What is metacognition?",
      "Awareness and regulation of your own thinking and learning strategies.",
      "Memory",
    ),
  ],
  "demo-set-biology": [
    makeFlashcard(
      "demo-card-bio-1",
      "demo-set-biology",
      "What is the role of mitochondria?",
      "Generate ATP through cellular respiration.",
      "Biology",
    ),
    makeFlashcard(
      "demo-card-bio-2",
      "demo-set-biology",
      "Define diffusion.",
      "Movement of particles from high to low concentration without energy.",
      "Biology",
      true,
    ),
    makeFlashcard(
      "demo-card-bio-3",
      "demo-set-biology",
      "What does the Golgi apparatus do?",
      "Modifies, sorts, and packages proteins for transport.",
      "Biology",
    ),
  ],
  "demo-set-history": [
    makeFlashcard(
      "demo-card-history-1",
      "demo-set-history",
      "When did World War I begin?",
      "1914.",
      "History",
    ),
    makeFlashcard(
      "demo-card-history-2",
      "demo-set-history",
      "What was the Congress of Vienna?",
      "An 1814-1815 conference that redrew Europe after Napoleon.",
      "History",
    ),
    makeFlashcard(
      "demo-card-history-3",
      "demo-set-history",
      "What triggered the French Revolution?",
      "Fiscal crisis, inequality, and political conflict in late 18th-century France.",
      "History",
    ),
  ],
};

function makeFlashcard(
  id: string,
  setId: string,
  front: string,
  back: string,
  tag: string,
  starred = false,
): DemoFlashcard {
  return {
    id,
    setId,
    front,
    back,
    starred,
    userId: DEMO_USER_ID,
    createdAt: DEMO_CREATED_AT,
    updatedAt: DEMO_UPDATED_AT,
    reviewCount: 0,
    tag,
  };
}

export function getDemoProfile(overrides?: Partial<Profile>): Profile {
  const baseStats = DEMO_PROFILE.stats;
  const overrideStats = overrides?.stats;

  return {
    ...DEMO_PROFILE,
    ...overrides,
    stats: {
      totalStudySessions:
        overrideStats?.totalStudySessions ?? baseStats?.totalStudySessions ?? 0,
      currentStreak: overrideStats?.currentStreak ?? baseStats?.currentStreak ?? 0,
      longestStreak: overrideStats?.longestStreak ?? baseStats?.longestStreak ?? 0,
      totalCardsStudied:
        overrideStats?.totalCardsStudied ?? baseStats?.totalCardsStudied ?? 0,
      lastStudiedAt: overrideStats?.lastStudiedAt ?? baseStats?.lastStudiedAt ?? null,
    },
  };
}

export function getDemoSets(): FlashcardSet[] {
  return DEMO_SETS_BASE.map((set) => ({
    ...set,
    stats: set.stats ? { ...set.stats } : undefined,
  }));
}

export function getDemoSetById(setId: string): FlashcardSet | undefined {
  const baseSet = DEMO_SETS_BASE.find((set) => set.id === setId);
  if (!baseSet) return undefined;

  return {
    ...baseSet,
    stats: baseSet.stats ? { ...baseSet.stats } : undefined,
    flashcards: getDemoFlashcardsBySet(setId),
  };
}

export function getDemoFlashcardsBySet(setId: string): Flashcard[] {
  const cards = DEMO_FLASHCARDS_BY_SET[setId] ?? [];
  return cards.map(({ tag: _tag, ...card }) => ({ ...card }));
}

export function getDemoFlashcardById(
  setId: string,
  cardId: string,
): Flashcard | undefined {
  return getDemoFlashcardsBySet(setId).find((card) => card.id === cardId);
}

export function getDemoSetStatsAfterStudy(setId: string): SetStats {
  const set = DEMO_SETS_BASE.find((entry) => entry.id === setId);
  const current = set?.stats;
  const now = new Date().toISOString();

  return {
    totalReviews: current?.totalReviews ?? 0,
    cardsStudied: current?.cardsStudied ?? 0,
    studySessions: (current?.studySessions ?? 0) + 1,
    lastStudiedAt: now,
  };
}
