import { FlashcardRepository } from "./repositories/flashcard-repository";
import { UserRepository } from "./repositories/user-repository";
import { SetRepository } from "./repositories/set-repository";
import { storage, STORAGE_KEYS } from "./storage";
import type { Flashcard } from "@/modules/types";

// Repository instances
export const flashcardRepository = new FlashcardRepository();
export const userRepository = new UserRepository();
export const setRepository = new SetRepository();

// Initialize data if empty (for first-time setup)
export const initializeData = async (): Promise<void> => {
  try {
    const flashcards = await storage.get<Flashcard[]>(STORAGE_KEYS.FLASHCARDS);

    if (flashcards.length === 0) {
      console.log("Initializing database with sample data...");
      // Create some initial sample data
      const sampleFlashcards: Flashcard[] = [
        {
          id: 1,
          front: "Hvad er hovedstaden i Danmark?",
          back: "København",
          set: "Geografi",
          createdAt: new Date().toISOString(),
          reviewCount: 0,
        },
        {
          id: 2,
          front: "Hvad er 2 + 2?",
          back: "4",
          set: "Matematik",
          createdAt: new Date().toISOString(),
          reviewCount: 0,
        },
        {
          id: 3,
          front: 'Hvem skrev "To be or not to be"?',
          back: "William Shakespeare",
          set: "Litteratur",
          createdAt: new Date().toISOString(),
          reviewCount: 0,
        },
      ];

      await storage.set(STORAGE_KEYS.FLASHCARDS, sampleFlashcards);
      await storage.set(STORAGE_KEYS.COUNTERS, { flashcardId: 4, setId: 1, userId: 1 });
      console.log("Sample data initialized");
    }
  } catch (error) {
    console.error("Failed to initialize data:", error);
  }
};

// Re-export types and utilities
export * from "./storage";
export * from "./repositories/flashcard-repository";
export * from "./repositories/user-repository";
export * from "./repositories/set-repository";