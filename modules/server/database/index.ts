import { FlashcardRepository } from "./repositories/flashcard.repository";
import { UserRepository } from "./repositories/user.repository";
import { SetRepository } from "./repositories/set.repository";
import { initializeData as initializeMongoDB } from "./mongo.storage";

// Repository instances
export const flashcardRepository = new FlashcardRepository();
export const userRepository = new UserRepository();
export const setRepository = new SetRepository();

// Initialize MongoDB database with indexes and setup
export const initializeData = initializeMongoDB;

// Re-export types and utilities
export * from "./mongo.storage";
export * from "./repositories/flashcard.repository";
export * from "./repositories/user.repository";
export * from "./repositories/set.repository";