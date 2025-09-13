import { storage, generateId, STORAGE_KEYS } from "../storage";
import type { User, CreateUserData, UpdateUserData } from "@/modules/types";

export class UserRepository {
  async getAll(): Promise<User[]> {
    return await storage.get<User[]>(STORAGE_KEYS.USERS);
  }

  async getById(id: number): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find((user) => user.id === id);
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await this.getAll();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  async create(data: CreateUserData): Promise<User> {
    const users = await this.getAll();

    // Check if user already exists
    const existingUser = users.find(
      (user) => user.email.toLowerCase() === data.email.toLowerCase()
    );

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

    users.push(newUser);
    await storage.set(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  async update(id: number, data: UpdateUserData): Promise<User> {
    const users = await this.getAll();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...data,
      id: users[userIndex].id, // Ensure ID doesn't change
      email: users[userIndex].email, // Ensure email doesn't change
      preferences: {
        studyGoal: data.preferences?.studyGoal || users[userIndex].preferences.studyGoal,
        theme: data.preferences?.theme || users[userIndex].preferences.theme,
        notifications: data.preferences?.notifications !== undefined ? data.preferences.notifications : users[userIndex].preferences.notifications,
      },
      stats: {
        totalStudySessions: data.stats?.totalStudySessions || users[userIndex].stats.totalStudySessions,
        currentStreak: data.stats?.currentStreak || users[userIndex].stats.currentStreak,
        longestStreak: data.stats?.longestStreak || users[userIndex].stats.longestStreak,
        totalCardsStudied: data.stats?.totalCardsStudied || users[userIndex].stats.totalCardsStudied,
      },
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    await storage.set(STORAGE_KEYS.USERS, users);
    return updatedUser;
  }

  async updateLastLogin(id: number): Promise<User> {
    return await this.update(id, { lastLogin: new Date() });
  }

  async delete(id: number): Promise<User> {
    const users = await this.getAll();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    await storage.set(STORAGE_KEYS.USERS, users);
    return deletedUser;
  }
}