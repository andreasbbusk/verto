"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/components/ui/alert-dialog";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { useSetsMutations } from "@/modules/data/client/hooks/mutations/useSets.client";
import { useSets } from "@/modules/data/client/hooks/queries/useSets.client";
import { useStudyProgressStore } from "@/modules/stores/study-progress.store";
import type {
  CreateSetData,
  FlashcardSet,
  UpdateSetData,
} from "@/modules/types/types";
import { BookOpen, Play, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SetCard } from "./set-card";
import { SetDialog } from "./set-dialog";

interface SetsGridProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

type ContinueStudyEntry = {
  set: FlashcardSet;
  progress: {
    currentIndex: number;
    lastStudied: string;
    totalCards: number;
  };
};

function SetsGrid({ sets, onEdit, onDelete }: SetsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sets.map((set, index) => (
        <div
          key={set.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: "backwards",
          }}
        >
          <SetCard set={set} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}

type SetsViewProps = {
  shouldOpenCreate?: boolean;
};

export function SetsView({ shouldOpenCreate }: SetsViewProps) {
  const { sets, error } = useSets();
  const studyProgress = useStudyProgressStore((state) => state.progress);
  const { create, update, remove } = useSetsMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null);
  const [dismissedContinueSetIds, setDismissedContinueSetIds] = useState<string[]>(
    [],
  );

  // Check for create URL param and auto-open dialog
  useEffect(() => {
    if (shouldOpenCreate) {
      setDialogOpen(true);
    }
  }, [shouldOpenCreate]);

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      await create(data);
    } catch (error) {
      toast.error("Could not create set");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateSetData) => {
    if (!editingSet) return;

    try {
      setIsSubmitting(true);
      await update({ id: editingSet.id, data });
    } catch (error) {
      toast.error("Could not update set");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: CreateSetData | UpdateSetData) => {
    if (editingSet) {
      await handleUpdate(data as UpdateSetData);
    } else {
      await handleCreate(data as CreateSetData);
    }
  };

  const handleEdit = (set: FlashcardSet) => {
    setEditingSet(set);
    setDialogOpen(true);
  };

  const handleDelete = (set: FlashcardSet) => {
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!setToDelete) return;

    try {
      await remove(setToDelete.id);
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    } catch {}
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Delay clearing editingSet to prevent flickering during close animation
      setTimeout(() => {
        setEditingSet(null);
      }, 200);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("dismissed-continue-sets");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          setDismissedContinueSetIds(parsed);
        }
      } catch {}
    }
  }, []);

  const totalCards = useMemo(() => {
    return sets.reduce((sum, set) => sum + (set.cardCount ?? 0), 0);
  }, [sets]);

  const continueStudy = useMemo<ContinueStudyEntry | null>(() => {
    if (sets.length === 0) return null;

    const setMap = new Map(sets.map((set) => [set.id, set]));
    const candidates = Object.entries(studyProgress)
      .map(([setId, progress]) => ({ set: setMap.get(setId), progress }))
      .filter((entry): entry is ContinueStudyEntry => Boolean(entry.set));

    const sorted = candidates.sort(
      (a, b) =>
        new Date(b.progress.lastStudied).getTime() -
        new Date(a.progress.lastStudied).getTime(),
    );

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    for (const entry of sorted) {
      if (dismissedContinueSetIds.includes(entry.set.id)) continue;
      const lastStudiedTime = new Date(entry.progress.lastStudied).getTime();
      if (Number.isNaN(lastStudiedTime)) continue;
      if (now - lastStudiedTime > sevenDaysMs) continue;
      if (entry.progress.totalCards <= 0) continue;
      if (entry.progress.currentIndex >= entry.progress.totalCards - 1) continue;
      return entry;
    }

    return null;
  }, [dismissedContinueSetIds, sets, studyProgress]);

  const handleDismissContinue = (setId: string) => {
    setDismissedContinueSetIds((prev) => {
      const next = prev.includes(setId) ? prev : [...prev, setId];
      localStorage.setItem("dismissed-continue-sets", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
              Flashcard sets
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage your sets here.
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="w-full transition-all hover:shadow-md hover:shadow-primary/20 lg:w-auto"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New set
          </Button>
        </div>
        <div className="h-px w-full bg-border" />
      </div>

      {/* Dialogs */}
      <SetDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        set={editingSet || undefined}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">
              Delete set?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the set &quot;{setToDelete?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div>
        {error ? (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-4">
                <div className="text-destructive text-lg">!</div>
              </div>
              <div className="text-destructive font-mono text-sm mb-2">
                {error}
              </div>
              <p className="text-muted-foreground text-sm">
                Try reloading the page
              </p>
            </div>
          </Card>
        ) : sets.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg text-foreground mb-2">
                  Create your first set
                </h3>
                <p className="text-muted-foreground text-sm">
                  Build a focused deck and start studying in minutes.
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                New set
              </Button>
            </div>
          </Card>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="space-y-6">
              {continueStudy?.set && (
                <Card className="p-3 w-full sm:max-w-md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div>
                        <p className="text-xs text-muted-foreground">Continue studying</p>
                        <p className="font-mono text-sm text-foreground">
                          {continueStudy.set.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/study/${continueStudy.set.id}`}>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Continue
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismissContinue(continueStudy.set.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <SetsGrid sets={sets} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
