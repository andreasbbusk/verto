import { FlashcardRepository } from "./repositories/flashcard.repository";
import { ProfileRepository } from "./repositories/profile.repository";
import { SetRepository } from "./repositories/set.repository";

// Repository instances
export const flashcardRepository = new FlashcardRepository();
export const profileRepository = new ProfileRepository();
export const setRepository = new SetRepository();

// Legacy alias for backwards compatibility
export const userRepository = profileRepository;

// Re-export repositories
export * from "./repositories/flashcard.repository";
export * from "./repositories/profile.repository";
export * from "./repositories/set.repository";