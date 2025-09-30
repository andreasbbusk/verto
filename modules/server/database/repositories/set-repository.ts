import { FlashcardRepository } from "./flashcard-repository";
import { generateId, storage, STORAGE_KEYS } from "../storage";
import type { FlashcardSet, CreateSetDataInternal } from "@/modules/types";

export class SetRepository {
  private flashcardRepo = new FlashcardRepository();

  // Sets are derived from flashcards using MongoDB aggregation for efficiency
  async getAll(): Promise<FlashcardSet[]> {
    const pipeline = [
      {
        $group: {
          _id: { userId: "$userId", set: "$set" },
          name: { $first: "$set" },
          userId: { $first: "$userId" },
          createdAt: { $min: "$createdAt" },
          cardCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          id: { $add: [{ $toInt: "$_id.userId" }, { $multiply: [{ $toInt: "$cardCount" }, 1000] }] },
          name: "$name",
          description: "",
          difficulty: 3,
          userId: "$userId",
          createdAt: "$createdAt",
          cardCount: "$cardCount"
        }
      },
      {
        $sort: { createdAt: 1 }
      }
    ];

    return await storage.aggregate<FlashcardSet>(STORAGE_KEYS.FLASHCARDS, pipeline);
  }

  async getByUserId(userId: number): Promise<FlashcardSet[]> {
    const pipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: "$set",
          name: { $first: "$set" },
          userId: { $first: "$userId" },
          createdAt: { $min: "$createdAt" },
          cardCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          id: { $add: [userId, { $multiply: ["$cardCount", 1000] }] },
          name: "$name",
          description: "",
          difficulty: 3,
          userId: "$userId",
          createdAt: "$createdAt",
          cardCount: "$cardCount"
        }
      },
      {
        $sort: { createdAt: 1 }
      }
    ];

    return await storage.aggregate<FlashcardSet>(STORAGE_KEYS.FLASHCARDS, pipeline);
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