import { generateId, storage, STORAGE_KEYS } from "../storage";
import type { FlashcardSet, CreateSetDataInternal, UpdateSetData, Flashcard } from "@/modules/types";

export class SetRepository {
  async getAll(): Promise<FlashcardSet[]> {
    return await storage.find<FlashcardSet>(STORAGE_KEYS.SETS);
  }

  async getById(id: number): Promise<FlashcardSet | undefined> {
    const set = await storage.findOne<FlashcardSet>(STORAGE_KEYS.SETS, { id });
    return set || undefined;
  }

  async getByIdWithFlashcards(id: number): Promise<FlashcardSet | undefined> {
    const set = await this.getById(id);
    if (!set) return undefined;

    const flashcards = await storage.find<Flashcard>(STORAGE_KEYS.FLASHCARDS, { setId: id });

    return {
      ...set,
      flashcards,
      cardCount: flashcards.length,
    };
  }

  async getByUserId(userId: number): Promise<FlashcardSet[]> {
    const sets = await storage.find<FlashcardSet>(STORAGE_KEYS.SETS, { userId });

    // Add card counts
    const setsWithCounts = await Promise.all(
      sets.map(async (set) => {
        const cardCount = await storage.count(STORAGE_KEYS.FLASHCARDS, { setId: set.id });
        return { ...set, cardCount };
      })
    );

    return setsWithCounts;
  }

  async create(data: CreateSetDataInternal): Promise<FlashcardSet> {
    const existingSets = await storage.find<FlashcardSet>(STORAGE_KEYS.SETS, {
      userId: data.userId,
      name: new RegExp(`^${data.name.trim()}$`, 'i')
    });

    if (existingSets.length > 0) {
      throw new Error("Set already exists");
    }

    const newSet: FlashcardSet = {
      id: await generateId("set"),
      name: data.name.trim(),
      description: data.description?.trim() || "",
      difficulty: data.difficulty || 3,
      starred: data.starred || false,
      userId: data.userId,
      createdAt: new Date().toISOString(),
    };

    await storage.insertOne(STORAGE_KEYS.SETS, newSet);
    return { ...newSet, cardCount: 0 };
  }

  async update(id: number, data: UpdateSetData): Promise<FlashcardSet> {
    const updateData: any = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.difficulty !== undefined && { difficulty: data.difficulty }),
      ...(data.starred !== undefined && { starred: data.starred }),
      updatedAt: new Date().toISOString(),
    };

    const updatedSet = await storage.updateOne<FlashcardSet>(
      STORAGE_KEYS.SETS,
      { id },
      { $set: updateData }
    );

    if (!updatedSet) {
      throw new Error("Set not found");
    }

    const cardCount = await storage.count(STORAGE_KEYS.FLASHCARDS, { setId: id });
    return { ...updatedSet, cardCount };
  }

  async delete(id: number): Promise<FlashcardSet> {
    const setToDelete = await this.getById(id);
    if (!setToDelete) {
      throw new Error("Set not found");
    }

    // Delete all flashcards in this set (cascade delete)
    await storage.deleteMany(STORAGE_KEYS.FLASHCARDS, { setId: id });

    // Delete the set
    await storage.deleteOne(STORAGE_KEYS.SETS, { id });

    return setToDelete;
  }
}