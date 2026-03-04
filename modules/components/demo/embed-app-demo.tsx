"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { FlashcardCard } from "@/modules/components/flashcards/card/flashcard-card";
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { VertoLogo } from "@/modules/components/ui/logo";
import type { Flashcard, FlashcardSet } from "@/modules/types/types";

type DemoView = "dashboard" | "library" | "study";

const DEMO_SETS: FlashcardSet[] = [
  {
    id: "demo-set-memory",
    name: "Cognitive Psychology Essentials",
    description: "Core memory and cognition concepts.",
    difficulty: 3,
    starred: false,
    userId: "demo-user",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    cardCount: 28,
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
    userId: "demo-user",
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
    userId: "demo-user",
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

const DEMO_FLASHCARDS: Record<string, Flashcard[]> = {
  "demo-set-memory": [
    makeFlashcard(
      "demo-card-memory-1",
      "demo-set-memory",
      "What is spaced repetition?",
      "A review strategy that increases the time between successful recalls.",
      "Memory",
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
): Flashcard & { tag: string } {
  return {
    id,
    setId,
    front,
    back,
    starred: false,
    userId: "demo-user",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z",
    reviewCount: 0,
    tag,
  };
}

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

export function EmbedAppDemo() {
  const [view, setView] = useState<DemoView>("dashboard");
  const [selectedSetId, setSelectedSetId] = useState(DEMO_SETS[0]?.id ?? "");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [starredIds, setStarredIds] = useState<Set<string>>(
    () => new Set(["demo-card-memory-1", "demo-card-bio-2"]),
  );
  const [starredOnly, setStarredOnly] = useState(false);

  const selectedSet = useMemo(
    () => DEMO_SETS.find((set) => set.id === selectedSetId) ?? DEMO_SETS[0],
    [selectedSetId],
  );

  const selectedCards = useMemo(() => {
    const cards = DEMO_FLASHCARDS[selectedSetId] ?? [];
    return cards.map((card) => ({
      ...card,
      starred: starredIds.has(card.id),
    }));
  }, [selectedSetId, starredIds]);

  const visibleCards = useMemo(() => {
    if (!starredOnly) return selectedCards;
    return selectedCards.filter((card) => card.starred);
  }, [selectedCards, starredOnly]);

  const safeActiveIndex = useMemo(() => {
    if (visibleCards.length === 0) return 0;
    return Math.min(activeIndex, visibleCards.length - 1);
  }, [activeIndex, visibleCards.length]);

  const activeCard = visibleCards[safeActiveIndex] ?? null;
  const totalCards = visibleCards.length;

  const totalCardsStudied = DEMO_SETS.reduce(
    (sum, set) => sum + (set.stats?.cardsStudied ?? 0),
    0,
  );
  const totalStudySessions = DEMO_SETS.reduce(
    (sum, set) => sum + (set.stats?.studySessions ?? 0),
    0,
  );

  const handleStudySet = (setId: string) => {
    setSelectedSetId(setId);
    setActiveIndex(0);
    setIsFlipped(false);
    setView("study");
  };

  const handlePrevious = () => {
    if (totalCards < 2) return;
    setIsFlipped(false);
    setActiveIndex((current) => {
      const base = Math.min(current, totalCards - 1);
      return (base - 1 + totalCards) % totalCards;
    });
  };

  const handleNext = () => {
    if (totalCards < 2) return;
    setIsFlipped(false);
    setActiveIndex((current) => {
      const base = Math.min(current, totalCards - 1);
      return (base + 1) % totalCards;
    });
  };

  const handleToggleStar = (flashcard: Flashcard) => {
    setStarredIds((current) => {
      const next = new Set(current);
      if (next.has(flashcard.id)) {
        next.delete(flashcard.id);
      } else {
        next.add(flashcard.id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <VertoLogo size="lg" textClassName="font-mono text-xl" />
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 bg-primary/10 font-mono text-[10px] uppercase tracking-[0.2em] text-primary"
            >
              Demo Mode
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DemoNavButton
              active={view === "dashboard"}
              label="Dashboard"
              onClick={() => setView("dashboard")}
            />
            <DemoNavButton
              active={view === "library"}
              label="Library"
              onClick={() => setView("library")}
            />
            <DemoNavButton
              active={view === "study"}
              label="Study"
              onClick={() => setView("study")}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
        {view === "dashboard" && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                icon={<BookOpen className="h-4 w-4" />}
                label="Cards studied"
                value={NUMBER_FORMAT.format(totalCardsStudied)}
              />
              <StatCard
                icon={<Brain className="h-4 w-4" />}
                label="Study sessions"
                value={NUMBER_FORMAT.format(totalStudySessions)}
              />
              <StatCard
                icon={<Layers className="h-4 w-4" />}
                label="Daily goal"
                value="20 cards"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-primary/20 bg-primary p-7 text-primary-foreground">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary-foreground/70">
                  Continue session
                </p>
                <h2 className="mt-3 font-mono text-2xl font-bold">
                  {selectedSet.name}
                </h2>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  {selectedSet.description}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    className="bg-background text-foreground hover:bg-background/90"
                    onClick={() => handleStudySet(selectedSet.id)}
                  >
                    Start demo study
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-primary-foreground/70 text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={() => setView("library")}
                  >
                    Browse sets
                  </Button>
                </div>
              </Card>

              <Card className="p-7">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">
                  Guest workspace
                </p>
                <h3 className="mt-3 font-mono text-xl font-bold text-foreground">
                  Full app flow, no login required
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  This embed runs with seeded local data so visitors can explore
                  dashboard, library, and study interactions directly.
                </p>
                <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                  <p>• Open set library and pick a topic.</p>
                  <p>• Flip cards and move through a study session.</p>
                  <p>• Star cards and filter to favorites only.</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {view === "library" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-mono text-3xl font-bold tracking-tight">
                  Flashcard sets
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Demo collection with realistic metadata and progress.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setView("dashboard")}>
                Back to dashboard
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {DEMO_SETS.map((set) => (
                <Card
                  key={set.id}
                  className="group flex h-full flex-col justify-between p-0"
                >
                  <div className="flex min-h-[150px]">
                    <div className="w-1.5 bg-primary" />
                    <div className="flex-1 px-5 py-5">
                      <h3 className="font-mono text-lg font-bold text-foreground">
                        {set.name}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {set.description}
                      </p>
                      <div className="mt-4 space-y-1 text-xs font-mono text-muted-foreground">
                        <p>
                          {set.cardCount} cards · {set.stats?.studySessions ?? 0}{" "}
                          sessions
                        </p>
                        <p>Difficulty {set.difficulty}/5</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border px-5 py-4">
                    <Button size="sm" onClick={() => handleStudySet(set.id)}>
                      <Play className="mr-2 h-4 w-4" />
                      Study set
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {view === "study" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-primary">
                  Study session
                </p>
                <h2 className="mt-1 font-mono text-3xl font-bold tracking-tight">
                  {selectedSet.name}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={starredOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStarredOnly((current) => !current);
                    setActiveIndex(0);
                    setIsFlipped(false);
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {starredOnly ? "Show all cards" : "Favorites only"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setView("library")}>
                  Back to library
                </Button>
              </div>
            </div>

            <Card className="p-6 sm:p-8">
              {activeCard ? (
                <>
                  <FlashcardCard
                    flashcard={activeCard}
                    isFlipped={isFlipped}
                    onFlip={setIsFlipped}
                    onToggleStar={handleToggleStar}
                    earmarkNumber={safeActiveIndex + 1}
                    earmarkLabel={(activeCard as Flashcard & { tag?: string }).tag}
                    className="w-full max-w-2xl"
                  />

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-mono uppercase tracking-[0.16em] text-muted-foreground">
                      Card {safeActiveIndex + 1} of {totalCards}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button
                        variant={isFlipped ? "secondary" : "default"}
                        size="sm"
                        onClick={() => setIsFlipped((current) => !current)}
                      >
                        {isFlipped ? "Show front" : "Flip"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleNext}>
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
                    No starred cards in this set
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setStarredOnly(false)}
                  >
                    Show all cards
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function DemoNavButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button variant={active ? "default" : "outline"} size="sm" onClick={onClick}>
      {label}
    </Button>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="gap-4 border-foreground/20 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/20 bg-background">
          {icon}
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-mono font-semibold text-foreground">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
