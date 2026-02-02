"use client";

import type { FlashcardSet } from "@/modules/types/types";
import { SetCardEditable } from "../card/set-card";

interface SetCardGridProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

export function SetCardGrid({ sets, onEdit, onDelete }: SetCardGridProps) {
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
          <SetCardEditable set={set} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}

export type { SetCardGridProps };
  
