import { storage, generateId, STORAGE_KEYS } from "../mongo.storage";
import type {
  Flashcard,
  CreateFlashcardDataInternal,
  UpdateFlashcardData
} from "@/modules/types";

export class FlashcardRepository {
  async getAll(): Promise<Flashcard[]> {
    return await storage.find<Flashcard>(STORAGE_KEYS.FLASHCARDS);
  }

  async getById(id: number): Promise<Flashcard | undefined> {
    const flashcard = await storage.findOne<Flashcard>(STORAGE_KEYS.FLASHCARDS, { id });
    return flashcard || undefined;
  }

  async getBySetId(setId: number): Promise<Flashcard[]> {
    return await storage.find<Flashcard>(STORAGE_KEYS.FLASHCARDS, { setId });
  }

  async getByUserId(userId: number): Promise<Flashcard[]> {
    return await storage.find<Flashcard>(STORAGE_KEYS.FLASHCARDS, { userId });
  }

  async create(data: CreateFlashcardDataInternal): Promise<Flashcard> {
    const newFlashcard: Flashcard = {
      id: await generateId("flashcard"),
      setId: data.setId,
      front: data.front.trim(),
      back: data.back.trim(),
      starred: data.starred || false,
      userId: data.userId,
      createdAt: new Date().toISOString(),
      reviewCount: 0,
    };

    await storage.insertOne(STORAGE_KEYS.FLASHCARDS, newFlashcard);
    return newFlashcard;
  }

  async update(id: number, data: UpdateFlashcardData): Promise<Flashcard> {
    const updateData: any = {
      ...(data.front !== undefined && { front: data.front.trim() }),
      ...(data.back !== undefined && { back: data.back.trim() }),
      ...(data.starred !== undefined && { starred: data.starred }),
      updatedAt: new Date().toISOString(),
    };

    const updatedFlashcard = await storage.updateOne<Flashcard>(
      STORAGE_KEYS.FLASHCARDS,
      { id },
      { $set: updateData }
    );

    if (!updatedFlashcard) {
      throw new Error("Flashcard not found");
    }

    return updatedFlashcard;
  }

  async delete(id: number): Promise<Flashcard> {
    const flashcardToDelete = await this.getById(id);
    if (!flashcardToDelete) {
      throw new Error("Flashcard not found");
    }

    await storage.deleteOne(STORAGE_KEYS.FLASHCARDS, { id });
    return flashcardToDelete;
  }
}