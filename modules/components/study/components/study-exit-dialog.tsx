"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/modules/components/ui/alert-dialog";

interface StudyExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: () => void;
}

export function StudyExitDialog({
  open,
  onOpenChange,
  onExit,
}: StudyExitDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End study session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end this study session and return to the set?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep studying</AlertDialogCancel>
          <AlertDialogAction onClick={onExit}>End session</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export type { StudyExitDialogProps };
