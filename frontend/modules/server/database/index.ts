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
    // Initialize counters if they don't exist
    const counters = await storage.get(STORAGE_KEYS.COUNTERS);
    if (!counters || typeof counters !== 'object') {
      await storage.set(STORAGE_KEYS.COUNTERS, { flashcardId: 1, setId: 1, userId: 1 });
      console.log("Initialized counters");
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