import clientPromise from "./mongodb-client";
import { Collection, Document, WithId } from "mongodb";
import type { Counters } from "@/modules/types";

/**
 * MongoDB-based storage abstraction layer
 */

// Generate unique auto-incrementing IDs for different entity types
export const generateId = async (
  type: "flashcard" | "set" | "user"
): Promise<number> => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);
  const countersCollection = db.collection<{ _id: string; value: number }>("counters");

  const result = await countersCollection.findOneAndUpdate(
    { _id: `${type}Id` },
    { $inc: { value: 1 } },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  return result?.value || 1;
};

const COLLECTION_NAMES = {
  USERS: "users",
  FLASHCARDS: "flashcards",
  SETS: "sets",
  STUDY_SESSIONS: "study_sessions",
} as const;

/**
 * Initialize database with proper indexes and default data
 */
export const initializeData = async (): Promise<void> => {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME);

  try {
    await Promise.all([
      db.collection(COLLECTION_NAMES.USERS).createIndex({ email: 1 }, { unique: true }),
      db.collection(COLLECTION_NAMES.USERS).createIndex({ id: 1 }, { unique: true }),
      db.collection(COLLECTION_NAMES.FLASHCARDS).createIndex({ userId: 1 }),
      db.collection(COLLECTION_NAMES.FLASHCARDS).createIndex({ setId: 1 }),
      db.collection(COLLECTION_NAMES.FLASHCARDS).createIndex({ id: 1 }, { unique: true }),
      db.collection(COLLECTION_NAMES.FLASHCARDS).createIndex({ userId: 1, setId: 1 }),
      db.collection(COLLECTION_NAMES.SETS).createIndex({ userId: 1 }),
      db.collection(COLLECTION_NAMES.SETS).createIndex({ name: 1 }),
      db.collection(COLLECTION_NAMES.SETS).createIndex({ id: 1 }, { unique: true }),
      db.collection(COLLECTION_NAMES.SETS).createIndex({ userId: 1, name: 1 }, { unique: true }),
      db.collection(COLLECTION_NAMES.STUDY_SESSIONS).createIndex({ userId: 1 }),
      db.collection(COLLECTION_NAMES.STUDY_SESSIONS).createIndex({ setId: 1 }),
      db.collection(COLLECTION_NAMES.STUDY_SESSIONS).createIndex({ startTime: -1 }),
    ]);

    console.log("Database indexes created successfully");
  } catch (error) {
    console.warn("Some indexes may already exist:", error);
  }
};

/**
 * Generic storage operations for MongoDB collections
 */
export const storage = {
  async getCollection<T extends Document = Document>(collectionName: string): Promise<Collection<T>> {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME);
    return db.collection<T>(collectionName);
  },

  /**
   * Find documents in a collection
   */
  async find<T extends Document = Document>(collectionName: string, filter: any = {}, options: any = {}): Promise<WithId<T>[]> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.find(filter, options).toArray();
  },

  /**
   * Find one document in a collection
   */
  async findOne<T extends Document = Document>(collectionName: string, filter: any): Promise<WithId<T> | null> {
    const collection = await this.getCollection<T>(collectionName);
    return collection.findOne(filter);
  },

  /**
   * Insert a document into a collection
   */
  async insertOne<T extends Document = Document>(collectionName: string, document: T): Promise<WithId<T>> {
    const collection = await this.getCollection<T>(collectionName);
    const result = await collection.insertOne(document as any);
    return { ...document, _id: result.insertedId } as WithId<T>;
  },

  /**
   * Insert multiple documents into a collection
   */
  async insertMany<T extends Document = Document>(collectionName: string, documents: T[]): Promise<WithId<T>[]> {
    const collection = await this.getCollection<T>(collectionName);
    const result = await collection.insertMany(documents as any);
    return documents.map((doc, index) => ({
      ...doc,
      _id: result.insertedIds[index]
    })) as WithId<T>[];
  },

  /**
   * Update a document in a collection
   */
  async updateOne<T extends Document = Document>(collectionName: string, filter: any, update: any, options: any = {}): Promise<WithId<T> | null> {
    const collection = await this.getCollection<T>(collectionName);
    const result = await collection.findOneAndUpdate(
      filter,
      update,
      { returnDocument: "after", ...options }
    );
    return result ? result as unknown as WithId<T> : null;
  },

  /**
   * Update multiple documents in a collection
   */
  async updateMany(collectionName: string, filter: any, update: any): Promise<number> {
    const collection = await this.getCollection(collectionName);
    const result = await collection.updateMany(filter, update);
    return result.modifiedCount;
  },

  /**
   * Delete a document from a collection
   */
  async deleteOne(collectionName: string, filter: any): Promise<boolean> {
    const collection = await this.getCollection(collectionName);
    const result = await collection.deleteOne(filter);
    return result.deletedCount > 0;
  },

  /**
   * Delete multiple documents from a collection
   */
  async deleteMany(collectionName: string, filter: any): Promise<number> {
    const collection = await this.getCollection(collectionName);
    const result = await collection.deleteMany(filter);
    return result.deletedCount;
  },

  /**
   * Count documents in a collection
   */
  async count(collectionName: string, filter: any = {}): Promise<number> {
    const collection = await this.getCollection(collectionName);
    return collection.countDocuments(filter);
  },

  /**
   * Perform aggregation operations
   */
  async aggregate<T extends Document = Document>(collectionName: string, pipeline: any[]): Promise<T[]> {
    const collection = await this.getCollection<Document>(collectionName);
    return collection.aggregate<T>(pipeline).toArray();
  }
};

// Export collection names for use in repositories
export const STORAGE_KEYS = COLLECTION_NAMES;