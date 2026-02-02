"use client";

import { useSetById } from "@/modules/data/client/hooks/queries/useSets.client";
import { useSetDetailActions } from "@/modules/data/client/hooks/useSetDetailActions.client";
import { formatShortDate } from "@/modules/lib/date";
import type {
  CreateFlashcardData,
  CreateSetData,
  Flashcard,
  FlashcardSet,
  UpdateFlashcardData,
} from "@/modules/types/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SetDetailState = {
  set: FlashcardSet | null | undefined;
  flashcards: Flashcard[];
  error: string | null;
  totalReviews: number;
  createdDateLabel: string;
  setDialogOpen: boolean;
  cardDialogOpen: boolean;
  editingCard: Flashcard | null;
  flashcardLoading: boolean;
};

type SetDetailActions = {
  openSetDialog: () => void;
  handleSetDialogChange: (open: boolean) => void;
  openCreateCardDialog: () => void;
  handleCardDialogChange: (open: boolean) => void;
  handleEditCard: (flashcard: Flashcard) => void;
  handleUpdateSet: (data: CreateSetData) => Promise<void>;
  handleDeleteSet: () => Promise<void>;
  handleBulkCreateCards: (
    cards: Omit<CreateFlashcardData, "setId">[]
  ) => Promise<void>;
  handleCardFormSubmit: (
    data: CreateFlashcardData | UpdateFlashcardData
  ) => Promise<void>;
  handleDeleteCard: (flashcard: Flashcard) => Promise<void>;
  handleToggleStar: (flashcard: Flashcard) => Promise<void>;
};

type SetDetailContextValue = {
  state: SetDetailState;
  actions: SetDetailActions;
  meta: { setId: string };
};

const SetDetailContext = createContext<SetDetailContextValue | null>(null);

type SetDetailProviderProps = {
  children: ReactNode;
  setId: string;
};

export function SetDetailProvider({ children, setId }: SetDetailProviderProps) {
  const { set, flashcards, error } = useSetById(setId);
  const [setDialogOpen, setSetDialogOpen] = useState(false);
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const openCreateCardDialog = useCallback(() => {
    setEditingCard(null);
    setCardDialogOpen(true);
  }, []);

  const {
    flashcardMutations,
    handleUpdateSet,
    handleDeleteSet,
    handleBulkCreateCards,
    handleCardFormSubmit,
    handleDeleteCard,
    handleToggleStar,
  } = useSetDetailActions({
    setId,
    set,
    editingCard,
    onOpenCreateCard: openCreateCardDialog,
  });

  const totalReviews = useMemo(() => {
    if (
      typeof set?.stats?.studySessions === "number" &&
      Number.isFinite(set.stats.studySessions)
    ) {
      return set.stats.studySessions;
    }
    return 0;
  }, [set?.stats?.studySessions]);

  const createdDateLabel = useMemo(() => {
    if (!set?.createdAt) return "";
    return formatShortDate(set.createdAt);
  }, [set]);

  const handleSetDialogChange = useCallback((open: boolean) => {
    setSetDialogOpen(open);
  }, []);

  const handleCardDialogChange = useCallback((open: boolean) => {
    setCardDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setEditingCard(null);
      }, 200);
    }
  }, []);

  const handleEditCard = useCallback((flashcard: Flashcard) => {
    setEditingCard(flashcard);
    setCardDialogOpen(true);
  }, []);

  const openSetDialog = useCallback(() => {
    setSetDialogOpen(true);
  }, []);

  const state = useMemo<SetDetailState>(
    () => ({
      set,
      flashcards,
      error,
      totalReviews,
      createdDateLabel,
      setDialogOpen,
      cardDialogOpen,
      editingCard,
      flashcardLoading:
        flashcardMutations.isCreating ||
        flashcardMutations.isUpdating ||
        flashcardMutations.isCreatingBulk,
    }),
    [
      cardDialogOpen,
      createdDateLabel,
      editingCard,
      error,
      flashcardMutations.isCreating,
      flashcardMutations.isCreatingBulk,
      flashcardMutations.isUpdating,
      flashcards,
      set,
      setDialogOpen,
      totalReviews,
    ]
  );

  const actions = useMemo<SetDetailActions>(
    () => ({
      openSetDialog,
      handleSetDialogChange,
      openCreateCardDialog,
      handleCardDialogChange,
      handleEditCard,
      handleUpdateSet,
      handleDeleteSet,
      handleBulkCreateCards,
      handleCardFormSubmit,
      handleDeleteCard,
      handleToggleStar,
    }),
    [
      handleBulkCreateCards,
      handleCardDialogChange,
      handleCardFormSubmit,
      handleDeleteCard,
      handleDeleteSet,
      handleEditCard,
      handleSetDialogChange,
      handleToggleStar,
      handleUpdateSet,
      openCreateCardDialog,
      openSetDialog,
    ]
  );

  const value = useMemo<SetDetailContextValue>(
    () => ({ state, actions, meta: { setId } }),
    [actions, setId, state]
  );

  return (
    <SetDetailContext.Provider value={value}>
      {children}
    </SetDetailContext.Provider>
  );
}

export function useSetDetailContext() {
  const context = useContext(SetDetailContext);

  if (!context) {
    throw new Error(
      "Set detail components must be used within SetDetailProvider."
    );
  }

  return context;
}
