"use client";

import { useSetsMutations } from "@/modules/data/client/hooks/mutations/useSets.client";
import {
  usePrefetchSetById,
  useSets,
} from "@/modules/data/client/hooks/queries/useSets.client";
import { useStudyProgressStore } from "@/modules/stores/study-progress.store";
import type {
  CreateSetData,
  FlashcardSet,
  UpdateSetData,
} from "@/modules/types/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

type ContinueStudyEntry = {
  set: FlashcardSet;
  progress: {
    currentIndex: number;
    lastStudied: string;
    totalCards: number;
  };
};

export type SetsState = {
  sets: FlashcardSet[];
  error: string | null;
  isLoading: boolean;
  continueStudy: ContinueStudyEntry | null;
  dialogOpen: boolean;
  editingSet: FlashcardSet | null;
  deleteDialogOpen: boolean;
  setToDelete: FlashcardSet | null;
  isSubmitting: boolean;
};

type SetsActions = {
  openCreateDialog: () => void;
  openEditDialog: (set: FlashcardSet) => void;
  handleDialogChange: (open: boolean) => void;
  handleCreate: (data: CreateSetData) => Promise<void>;
  handleUpdate: (data: UpdateSetData) => Promise<void>;
  requestDelete: (set: FlashcardSet) => void;
  handleDeleteDialogChange: (open: boolean) => void;
  confirmDelete: () => Promise<void>;
  dismissContinue: (setId: string) => void;
  prefetchSetById: (id: string) => void;
};

type SetsContextValue = {
  state: SetsState;
  actions: SetsActions;
  meta: Record<string, never>;
};

const SetsContext = createContext<SetsContextValue | null>(null);

type SetsProviderProps = {
  children: ReactNode;
  shouldOpenCreate?: boolean;
};

export function SetsProvider({
  children,
  shouldOpenCreate,
}: SetsProviderProps) {
  const { sets, error, isLoading } = useSets();
  const prefetchSetById = usePrefetchSetById();
  const studyProgress = useStudyProgressStore((state) => state.progress);
  const { create, update, remove } = useSetsMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null);
  const [dismissedContinueSetIds, setDismissedContinueSetIds] = useState<
    string[]
  >([]);

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

  const continueStudy = useMemo<ContinueStudyEntry | null>(() => {
    if (sets.length === 0) return null;

    const setMap = new Map(sets.map((set) => [set.id, set]));
    const candidates = Object.entries(studyProgress)
      .map(([setId, progress]) => ({ set: setMap.get(setId), progress }))
      .filter((entry): entry is ContinueStudyEntry => Boolean(entry.set));

    const sorted = candidates.sort(
      (a, b) =>
        new Date(b.progress.lastStudied).getTime() -
        new Date(a.progress.lastStudied).getTime()
    );

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    for (const entry of sorted) {
      if (dismissedContinueSetIds.includes(entry.set.id)) continue;
      const lastStudiedTime = new Date(entry.progress.lastStudied).getTime();
      if (Number.isNaN(lastStudiedTime)) continue;
      if (now - lastStudiedTime > sevenDaysMs) continue;
      if (entry.progress.totalCards <= 0) continue;
      if (entry.progress.currentIndex >= entry.progress.totalCards - 1)
        continue;
      return entry;
    }

    return null;
  }, [dismissedContinueSetIds, sets, studyProgress]);

  const openCreateDialog = useCallback(() => {
    setEditingSet(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((set: FlashcardSet) => {
    setEditingSet(set);
    setDialogOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setEditingSet(null);
      }, 200);
    }
  }, []);

  const handleCreate = useCallback(
    async (data: CreateSetData) => {
      try {
        setIsSubmitting(true);
        await create(data);
      } catch (error) {
        toast.error("Could not create set");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [create]
  );

  const handleUpdate = useCallback(
    async (data: UpdateSetData) => {
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
    },
    [editingSet, update]
  );

  const requestDelete = useCallback((set: FlashcardSet) => {
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogChange = useCallback((open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setSetToDelete(null);
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!setToDelete) return;

    try {
      await remove(setToDelete.id);
    } catch {
    } finally {
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    }
  }, [remove, setToDelete]);

  const dismissContinue = useCallback((setId: string) => {
    setDismissedContinueSetIds((prev) => {
      const next = prev.includes(setId) ? prev : [...prev, setId];
      localStorage.setItem("dismissed-continue-sets", JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (shouldOpenCreate) {
      openCreateDialog();
    }
  }, [openCreateDialog, shouldOpenCreate]);

  const state = useMemo<SetsState>(
    () => ({
      sets,
      error,
      isLoading,
      continueStudy,
      dialogOpen,
      editingSet,
      deleteDialogOpen,
      setToDelete,
      isSubmitting,
    }),
    [
      continueStudy,
      deleteDialogOpen,
      dialogOpen,
      editingSet,
      error,
      isLoading,
      isSubmitting,
      setToDelete,
      sets,
    ]
  );

  const actions = useMemo<SetsActions>(
    () => ({
      openCreateDialog,
      openEditDialog,
      handleDialogChange,
      handleCreate,
      handleUpdate,
      requestDelete,
      handleDeleteDialogChange,
      confirmDelete,
      dismissContinue,
      prefetchSetById,
    }),
    [
      confirmDelete,
      dismissContinue,
      handleCreate,
      handleDeleteDialogChange,
      handleDialogChange,
      handleUpdate,
      openCreateDialog,
      openEditDialog,
      prefetchSetById,
      requestDelete,
    ]
  );

  const value = useMemo<SetsContextValue>(
    () => ({ state, actions, meta: {} }),
    [actions, state]
  );

  return <SetsContext.Provider value={value}>{children}</SetsContext.Provider>;
}

export function useSetsContext() {
  const context = useContext(SetsContext);

  if (!context) {
    throw new Error("Sets components must be used within SetsProvider.");
  }

  return context;
}
