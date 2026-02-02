"use client";

import { SetDetailProvider } from "./set-detail-context";
import {
  SetDetailActions,
  SetDetailDialogs,
  SetDetailError,
  SetDetailFlashcards,
  SetDetailHeader,
  SetDetailStats,
} from "./set-detail-sections";
import { useSetDetailContext } from "./set-detail-context";

interface SetDetailViewProps {
  setId: string;
}

function SetDetailContent() {
  const {
    state: { error, set },
  } = useSetDetailContext();

  if (error || !set) {
    return <SetDetailError />;
  }

  return (
    <div className="space-y-8">
      <SetDetailHeader />
      <SetDetailActions />
      <SetDetailStats />
      <SetDetailDialogs />
      <SetDetailFlashcards />
    </div>
  );
}

export function SetDetailView({ setId }: SetDetailViewProps) {
  return (
    <SetDetailProvider setId={setId}>
      <SetDetailContent />
    </SetDetailProvider>
  );
}
