import { FlashcardRepository } from "./flashcard-repository";
import { generateId } from "../storage";
import type { FlashcardSet, CreateSetDataInternal } from "@/modules/types";

export class SetRepository {
  private flashcardRepo = new FlashcardRepository();

  // Sets are derived from flashcards in this implementation
  async getAll(): Promise<FlashcardSet[]> {
    const flashcards = await this.flashcardRepo.getAll();
    const setMap = new Map<string, FlashcardSet>();

    flashcards.forEach((card) => {
      const setKey = `${card.userId}-${card.set.toLowerCase()}`;
      if (!setMap.has(setKey)) {
        setMap.set(setKey, {
          id: setMap.size + 1,
          name: card.set,
          description: "",
          difficulty: 3, // Default difficulty
          userId: card.userId,
          createdAt: card.createdAt,
          cardCount: 1,
        });
      } else {
        const existingSet = setMap.get(setKey)!;
        existingSet.cardCount++;
        // Use earliest creation date
        if (card.createdAt < existingSet.createdAt) {
          existingSet.createdAt = card.createdAt;
        }
      }
    });

    return Array.from(setMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async getByUserId(userId: number): Promise<FlashcardSet[]> {
    const flashcards = await this.flashcardRepo.getByUserId(userId);
    const setMap = new Map<string, FlashcardSet>();

    flashcards.forEach((card) => {
      const setKey = card.set.toLowerCase();
      if (!setMap.has(setKey)) {
        setMap.set(setKey, {
          id: setMap.size + 1,
          name: card.set,
          description: "",
          difficulty: 3, // Default difficulty
          userId: card.userId,
          createdAt: card.createdAt,
          cardCount: 1,
        });
      } else {
        const existingSet = setMap.get(setKey)!;
        existingSet.cardCount++;
        // Use earliest creation date
        if (card.createdAt < existingSet.createdAt) {
          existingSet.createdAt = card.createdAt;
        }
      }
    });

    return Array.from(setMap.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  async create(data: CreateSetDataInternal): Promise<FlashcardSet> {
    // For this implementation, sets are derived from flashcards
    // We can create an empty set by creating a placeholder flashcard
    const userSets = await this.getByUserId(data.userId);
    const existingSet = userSets.find(
      (set) => set.name.toLowerCase() === data.name.toLowerCase()
    );

    if (existingSet) {
      throw new Error("Set already exists");
    }

    // Create a placeholder flashcard to represent the set
    await this.flashcardRepo.create({
      front: "Welcome to " + data.name,
      back: "This is your new flashcard set. Edit or delete this card and add your own!",
      set: data.name.trim(),
      userId: data.userId,
    });

    return {
      id: await generateId("set"),
      name: data.name.trim(),
      description: data.description?.trim() || "",
      difficulty: data.difficulty || 3,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      cardCount: 1,
    };
  }
}