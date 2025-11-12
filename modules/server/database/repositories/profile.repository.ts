import { createClient } from "@/modules/lib/supabase/server";
import type { Profile, UpdateProfileData } from "@/modules/types";

export class ProfileRepository {
  async getById(id: string): Promise<Profile | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return this.mapToProfile(data);
  }

  async getByEmail(email: string): Promise<Profile | null> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error) {
      console.error("Error fetching profile by email:", error);
      return null;
    }

    return this.mapToProfile(data);
  }

  async update(id: string, data: UpdateProfileData): Promise<Profile | null> {
    const supabase = await createClient();
    
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.studyGoal !== undefined) updateData.study_goal = data.studyGoal;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.notifications !== undefined) updateData.notifications = data.notifications;
    if (data.totalStudySessions !== undefined) updateData.total_study_sessions = data.totalStudySessions;
    if (data.currentStreak !== undefined) updateData.current_streak = data.currentStreak;
    if (data.longestStreak !== undefined) updateData.longest_streak = data.longestStreak;
    if (data.totalCardsStudied !== undefined) updateData.total_cards_studied = data.totalCardsStudied;
    if (data.lastLogin !== undefined) updateData.last_login = data.lastLogin;

    const { data: updatedData, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }

    return this.mapToProfile(updatedData);
  }

  async updateLastLogin(id: string): Promise<Profile | null> {
    return this.update(id, { lastLogin: new Date().toISOString() });
  }

  private mapToProfile(data: any): Profile {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      createdAt: data.created_at,
      lastLogin: data.last_login,
      updatedAt: data.updated_at,
      studyGoal: data.study_goal,
      theme: data.theme,
      notifications: data.notifications,
      totalStudySessions: data.total_study_sessions,
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      totalCardsStudied: data.total_cards_studied,
    };
  }
}

