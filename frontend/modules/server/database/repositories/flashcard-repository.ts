import { storage, generateId, STORAGE_KEYS } from "../storage";
import type { 
  Flashcard, 
  CreateFlashcardDataInternal, 
  UpdateFlashcardData 
} from "@/modules/types";

export class FlashcardRepository {
  async getAll(): Promise<Flashcard[]> {
    return await storage.get<Flashcard[]>(STORAGE_KEYS.FLASHCARDS);
  }

  async getById(id: number): Promise<Flashcard | undefined> {
    const flashcards = await this.getAll();
    return flashcards.find((card) => card.id === id);
  }

  async getBySet(setName: string): Promise<Flashcard[]> {
    const flashcards = await this.getAll();
    return flashcards.filter(
      (card) => card.set.toLowerCase() === setName.toLowerCase()
    );
  }

  async getByUserId(userId: number): Promise<Flashcard[]> {
    const flashcards = await this.getAll();
    return flashcards.filter((card) => card.userId === userId);
  }

  async getByUserIdAndSet(userId: number, setName: string): Promise<Flashcard[]> {
    const flashcards = await this.getByUserId(userId);
    return flashcards.filter(
      (card) => card.set.toLowerCase() === setName.toLowerCase()
    );
  }

  async create(data: CreateFlashcardDataInternal): Promise<Flashcard> {
    const flashcards = await this.getAll();
    const newFlashcard: Flashcard = {
      id: await generateId("flashcard"),
      front: data.front.trim(),
      back: data.back.trim(),
      set: data.set || "General",
      userId: data.userId,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
    };

    flashcards.push(newFlashcard);
    await storage.set(STORAGE_KEYS.FLASHCARDS, flashcards);
    return newFlashcard;
  }

  async update(id: number, data: UpdateFlashcardData): Promise<Flashcard> {
    const flashcards = await this.getAll();
    const flashcardIndex = flashcards.findIndex((card) => card.id === id);

    if (flashcardIndex === -1) {
      throw new Error("Flashcard not found");
    }

    const updatedFlashcard: Flashcard = {
      ...flashcards[flashcardIndex],
      front: data.front?.trim() || flashcards[flashcardIndex].front,
      back: data.back?.trim() || flashcards[flashcardIndex].back,
      set: data.set || flashcards[flashcardIndex].set,
      updatedAt: new Date().toISOString(),
    };

    flashcards[flashcardIndex] = updatedFlashcard;
    await storage.set(STORAGE_KEYS.FLASHCARDS, flashcards);
    return updatedFlashcard;
  }

  async delete(id: number): Promise<Flashcard> {
    const flashcards = await this.getAll();
    const flashcardIndex = flashcards.findIndex((card) => card.id === id);

    if (flashcardIndex === -1) {
      throw new Error("Flashcard not found");
    }

    const deletedFlashcard = flashcards.splice(flashcardIndex, 1)[0];
    await storage.set(STORAGE_KEYS.FLASHCARDS, flashcards);
    return deletedFlashcard;
  }
}