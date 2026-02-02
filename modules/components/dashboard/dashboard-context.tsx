"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { FlashcardSet, Profile, ProfileStats } from "@/modules/types/types";

export type DashboardState = {
  user: Profile;
  profileStats?: ProfileStats;
  studyGoal: number;
  sets: FlashcardSet[];
  setsLoading: boolean;
  recentSet: FlashcardSet | null;
  formattedLastStudied: string;
};

type DashboardContextValue = {
  state: DashboardState;
  actions: Record<string, never>;
  meta: Record<string, never>;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  children,
  state,
}: {
  children: ReactNode;
  state: DashboardState;
}) {
  const value = useMemo<DashboardContextValue>(
    () => ({ state, actions: {}, meta: {} }),
    [state],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("Dashboard components must be used within DashboardProvider.");
  }

  return context;
}
