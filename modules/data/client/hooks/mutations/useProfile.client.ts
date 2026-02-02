import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  deleteProfile,
  updateProfile,
  updateProfileStats,
} from "@/modules/server/actions/user";
import { queryKeys } from "@/modules/data/shared/queryKeys";
import type {
  UpdateProfileData,
  UpdateProfileStatsData,
} from "@/modules/types/types";

export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.me, profile);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    },
  });

  const updateStatsMutation = useMutation({
    mutationFn: (data: UpdateProfileStatsData) => updateProfileStats(data),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.me, profile);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile stats",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProfile(),
    onSuccess: () => {
      queryClient.clear();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete profile",
      );
    },
  });

  return {
    update: updateMutation.mutateAsync,
    updateStats: updateStatsMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isUpdatingStats: updateStatsMutation.isPending,
    deleteProfile: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
