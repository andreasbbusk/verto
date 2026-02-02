import type { Profile } from "@/modules/types/types";

export function mapProfile(row: any): Profile {
  const statsRow = Array.isArray(row.profile_stats)
    ? row.profile_stats[0]
    : row.profile_stats;

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
    stats: statsRow
      ? {
          totalStudySessions: statsRow.total_study_sessions ?? 0,
          currentStreak: statsRow.current_streak ?? 0,
          longestStreak: statsRow.longest_streak ?? 0,
          totalCardsStudied: statsRow.total_cards_studied ?? 0,
          lastStudiedAt: statsRow.last_studied_at ?? null,
        }
      : undefined,
  };
}
