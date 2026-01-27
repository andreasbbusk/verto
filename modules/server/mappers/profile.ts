import type { Profile } from "@/modules/types/types";

export function mapProfile(row: any): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLogin: row.last_login,
    studyGoal: row.study_goal,
    theme: row.theme,
    notifications: row.notifications,
    totalStudySessions: row.total_study_sessions,
    currentStreak: row.current_streak,
    longestStreak: row.longest_streak,
    totalCardsStudied: row.total_cards_studied,
  };
}
