import { storage, generateId, STORAGE_KEYS } from "../mongo.storage";
import type { User, CreateUserData, UpdateUserData } from "@/modules/types";

export class UserRepository {
  async getAll(): Promise<User[]> {
    return await storage.find<User>(STORAGE_KEYS.USERS);
  }

  async getById(id: number): Promise<User | undefined> {
    const user = await storage.findOne<User>(STORAGE_KEYS.USERS, { id });
    return user || undefined;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const user = await storage.findOne<User>(STORAGE_KEYS.USERS, { 
      email: email.toLowerCase() 
    });
    return user || undefined;
  }

  async create(data: CreateUserData): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const newUser: User = {
      id: await generateId("user"),
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      password: data.password, // Should already be hashed
      createdAt: data.createdAt || new Date(),
      lastLogin: data.lastLogin || new Date(),
      preferences: {
        studyGoal: data.preferences?.studyGoal || 20,
        theme: data.preferences?.theme || "system",
        notifications: data.preferences?.notifications !== false,
      },
      stats: {
        totalStudySessions: data.stats?.totalStudySessions || 0,
        currentStreak: data.stats?.currentStreak || 0,
        longestStreak: data.stats?.longestStreak || 0,
        totalCardsStudied: data.stats?.totalCardsStudied || 0,
      },
    };

    await storage.insertOne(STORAGE_KEYS.USERS, newUser);
    return newUser;
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const updateData: any = { ...data, updatedAt: new Date() };
    
    // Handle nested preference updates
    if (data.preferences) {
      updateData.$set = updateData.$set || {};
      Object.keys(data.preferences).forEach(key => {
        updateData.$set[`preferences.${key}`] = data.preferences![key as keyof typeof data.preferences];
      });
      delete updateData.preferences;
    }
    
    // Handle nested stats updates
    if (data.stats) {
      updateData.$set = updateData.$set || {};
      Object.keys(data.stats).forEach(key => {
        updateData.$set[`stats.${key}`] = data.stats![key as keyof typeof data.stats];
      });
      delete updateData.stats;
    }

    const updatedUser = await storage.updateOne<User>(
      STORAGE_KEYS.USERS, 
      { id }, 
      updateData.$set ? { $set: updateData.$set, ...updateData } : { $set: updateData }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async updateLastLogin(id: number): Promise<User> {
    return await this.update(id, { lastLogin: new Date() });
  }

  async delete(id: number): Promise<User> {
    const userToDelete = await this.getById(id);
    if (!userToDelete) {
      throw new Error("User not found");
    }

    await storage.deleteOne(STORAGE_KEYS.USERS, { id });
    return userToDelete;
  }
}