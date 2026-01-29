"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";
import { useProfileMutations } from "@/modules/data/client/hooks/mutations/useProfile.client";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { Input } from "@/modules/components/ui/input";
import { Label } from "@/modules/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/modules/components/ui/alert-dialog";
import type { UpdateProfileData } from "@/modules/types/types";

export function SettingsView() {
  const { data: profile } = useQuery(profileQuery());
  const { update, deleteProfile, isUpdating, isDeleting } =
    useProfileMutations();
  const router = useRouter();

  const [name, setName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setName(profile.name ?? "");
  }, [profile]);

  const changes = useMemo(() => {
    if (!profile) return null;

    const trimmedName = name.trim();

    const updateData: UpdateProfileData = {};

    if (trimmedName && trimmedName !== profile.name) {
      updateData.name = trimmedName;
    }

    return updateData;
  }, [name, profile]);

  const hasChanges = Boolean(changes && Object.keys(changes).length > 0);

  const handleSave = async () => {
    if (!profile) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Name can't be empty");
      return;
    }

    if (!changes || Object.keys(changes).length === 0) {
      return;
    }

    try {
      await update(changes);
      toast.success("Settings updated");
    } catch {
      return;
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const result = await deleteProfile();
      if (!result?.deletedAuthUser) {
        toast(
          "Profile data deleted. Contact support to remove your sign-in account.",
        );
      } else {
        toast.success("Profile deleted");
      }
      router.push("/");
      router.refresh();
    } catch {
      return;
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Update your profile, study preferences, and notification settings.
          </p>
        </div>
        <div className="h-px w-full bg-border" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-mono text-lg font-semibold text-foreground">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your name and account details.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Name</Label>
              <Input
                id="settings-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input
                id="settings-email"
                value={profile.email}
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email is managed by your sign-in provider.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-destructive/40">
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="font-mono text-lg font-semibold text-foreground">
              Danger zone
            </h2>
            <p className="text-sm text-muted-foreground">
              Delete your profile and all associated data.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              This removes your profile, flashcard sets, flashcards, and study
              stats. This action cannot be undone.
            </p>
          </div>
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete profile"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-mono">
                  Delete your profile?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Your account data, sets, flashcards, and study history will be
                  permanently removed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfile}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete profile
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
