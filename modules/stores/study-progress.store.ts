import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudyProgress {
  [setId: string]: {
    currentIndex: number;
    lastStudied: string; // ISO date string
    totalCards: number;
  };
}

interface StudyProgressStore {
  progress: StudyProgress;
  getProgress: (setId: string) => number | null;
  saveProgress: (setId: string, currentIndex: number, totalCards: number) => void;
  clearProgress: (setId: string) => void;
}

export const useStudyProgressStore = create<StudyProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},

      getProgress: (setId: string) => {
        const { progress } = get();
        const setProgress = progress[setId];

        if (!setProgress) {
          return null;
        }

        // Return the saved index if it exists
        return setProgress.currentIndex;
      },

      saveProgress: (setId: string, currentIndex: number, totalCards: number) => {
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

      clearProgress: (setId: string) => {
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
