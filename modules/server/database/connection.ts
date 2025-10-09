import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Global variables for connection caching
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const clientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
};

/**
 * Connect to MongoDB with connection pooling and caching
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Validate required environment variables at runtime
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is required");
  }

  if (!dbName) {
    throw new Error("MONGODB_DB_NAME environment variable is required");
  }

  // Return cached connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Create new client if not cached
    if (!cachedClient) {
      cachedClient = new MongoClient(uri, clientOptions);
      await cachedClient.connect();
      
      // Verify connection
      await cachedClient.db("admin").command({ ping: 1 });
      console.log("Successfully connected to MongoDB Atlas!");
    }

    // Get database instance
    if (!cachedDb) {
      cachedDb = cachedClient.db(dbName);
    }

    return { client: cachedClient, db: cachedDb };
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    
    // Reset cached connections on error
    cachedClient = null;
    cachedDb = null;
    
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get database instance (convenience function)
 */
export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Close database connection (for cleanup)
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("Database connection closed");
  }
}

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { client } = await connectToDatabase();
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

// Collection names constants
export const COLLECTION_NAMES = {
  USERS: "users",
  FLASHCARDS: "flashcards", 
  SETS: "sets",
  STUDY_SESSIONS: "study_sessions",
} as const;

export type CollectionName = keyof typeof COLLECTION_NAMES;