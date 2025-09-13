import { createClient, RedisClientType } from "redis";
import type { Counters } from "@/modules/types";

const FLASHCARDS_KEY = "flashcards";
const SETS_KEY = "sets";
const USERS_KEY = "users";
const COUNTERS_KEY = "counters";

// Initialize Redis client following Vercel guidelines
let redisClient: RedisClientType;

const getRedisConnection = async (): Promise<RedisClientType | null> => {
  if (!redisClient && process.env.REDIS_URL) {
    redisClient = await createClient({ url: process.env.REDIS_URL }).connect() as RedisClientType;
  }
  return redisClient;
};

// In-memory storage for fallback
let memoryStorage: {
  flashcards: any[];
  sets: any[];
  users: any[];
  counters: Counters;
} = {
  flashcards: [],
  sets: [],
  users: [],
  counters: { flashcardId: 1, setId: 1, userId: 1 },
};

// Storage abstraction layer
export const storage = {
  async get<T>(key: string): Promise<T> {
    try {
      if (process.env.REDIS_URL) {
        const redisClient = await getRedisConnection();
        if (redisClient) {
          const data = await redisClient.get(key);
          if (data) {
            return JSON.parse(data) as T;
          }
        }
        // Return default values for each key type
        if (key === COUNTERS_KEY) {
          return { flashcardId: 1, setId: 1, userId: 1 } as T;
        }
        return [] as T;
      }
    } catch (error) {
      console.warn("Redis get failed, falling back to memory:", error);
    }

    // Fallback to memory
    const memoryKey = key.replace(":", "") as keyof typeof memoryStorage;
    return (memoryStorage[memoryKey] ||
      (key === COUNTERS_KEY
        ? { flashcardId: 1, setId: 1, userId: 1 }
        : [])) as T;
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      if (process.env.REDIS_URL) {
        const redisClient = await getRedisConnection();
        if (redisClient) {
          await redisClient.set(key, JSON.stringify(value));
          return;
        }
      }
    } catch (error) {
      console.warn("Redis set failed, falling back to memory:", error);
    }

    // Fallback to memory
    const memoryKey = key.replace(":", "") as keyof typeof memoryStorage;
    (memoryStorage[memoryKey] as T) = value;
  },
};

// Generate unique ID
export const generateId = async (
  type: "flashcard" | "set" | "user"
): Promise<number> => {
  const counters = await storage.get<Counters>(COUNTERS_KEY);
  const newId = counters[`${type}Id` as keyof Counters];
  counters[`${type}Id` as keyof Counters] = newId + 1;
  await storage.set(COUNTERS_KEY, counters);
  return newId;
};

// Storage keys export for use in repositories
export const STORAGE_KEYS = {
  FLASHCARDS: FLASHCARDS_KEY,
  SETS: SETS_KEY,
  USERS: USERS_KEY,
  COUNTERS: COUNTERS_KEY,
} as const;