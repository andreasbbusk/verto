import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "table" | "grid";

interface ViewStore {
  setsView: ViewMode;
  flashcardsView: ViewMode;
  setSetsView: (view: ViewMode) => void;
  setFlashcardsView: (view: ViewMode) => void;
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      setsView: "table",
      flashcardsView: "table",
      setSetsView: (view) => set({ setsView: view }),
      setFlashcardsView: (view) => set({ flashcardsView: view }),
    }),
    {
      name: "view-preferences",
    }
  )
);
