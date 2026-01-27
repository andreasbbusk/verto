export const queryKeys = {
  sets: ["sets"] as const,
  setById: (id: string) => ["sets", id] as const,
  flashcardsBySet: (setId: string) => ["flashcards", "set", setId] as const,
  me: ["me"] as const,
};
