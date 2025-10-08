import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudyProgress {
  [setId: number]: {
    currentIndex: number;
    lastStudied: string; // ISO date string
    totalCards: number;
  };
}

interface StudyProgressStore {
  progress: StudyProgress;
  getProgress: (setId: number) => number | null;
  saveProgress: (setId: number, currentIndex: number, totalCards: number) => void;
  clearProgress: (setId: number) => void;
}

export const useStudyProgressStore = create<StudyProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},

      getProgress: (setId: number) => {
        const { progress } = get();
        const setProgress = progress[setId];

        if (!setProgress) {
          return null;
        }

        // Return the saved index if it exists
        return setProgress.currentIndex;
      },

      saveProgress: (setId: number, currentIndex: number, totalCards: number) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [setId]: {
              currentIndex,
              lastStudied: new Date().toISOString(),
              totalCards,
            },
          },
        }));
      },

      clearProgress: (setId: number) => {
        set((state) => {
          const newProgress = { ...state.progress };
          delete newProgress[setId];
          return { progress: newProgress };
        });
      },
    }),
    {
      name: "study-progress",
    }
  )
);
