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
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import { useSetsMutations } from "@/modules/data/client/hooks/mutations/useSets.client";
import { useSets } from "@/modules/data/client/hooks/queries/useSets.client";
import type {
  CreateSetData,
  FlashcardSet,
  UpdateSetData,
} from "@/modules/types/types";
import { BookOpen, PlusCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SetCard } from "./set-card";
import { SetDialog } from "./set-dialog";

interface SetsGridProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

function SetsGrid({ sets, onEdit, onDelete }: SetsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sets.map((set, index) => (
        <div
          key={set.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: "backwards",
          }}
        >
          <SetCard set={set} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}

export function SetsView() {
  const searchParams = useSearchParams();
  const { sets, isLoading, error } = useSets();
  const { create, update, remove } = useSetsMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashcardSet | null>(null);

  // Check for create URL param and auto-open dialog
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setDialogOpen(true);
    }
  }, [searchParams]);

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      await create(data);
    } catch (error) {
      toast.error("Could not create set");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateSetData) => {
    if (!editingSet) return;

    try {
      setIsSubmitting(true);
      await update({ id: editingSet.id, data });
    } catch (error) {
      toast.error("Could not update set");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: CreateSetData | UpdateSetData) => {
    if (editingSet) {
      await handleUpdate(data as UpdateSetData);
    } else {
      await handleCreate(data as CreateSetData);
    }
  };

  const handleEdit = (set: FlashcardSet) => {
    setEditingSet(set);
    setDialogOpen(true);
  };

  const handleDelete = (set: FlashcardSet) => {
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!setToDelete) return;

    try {
      await remove(setToDelete.id);
      toast.success("Set deleted!");
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    } catch (error) {
      toast.error("Could not delete set");
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Delay clearing editingSet to prevent flickering during close animation
      setTimeout(() => {
        setEditingSet(null);
      }, 200);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
              Flashcard sets
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Manage your sets here.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setDialogOpen(true)}
              size="sm"
              className="transition-all hover:shadow-md hover:shadow-primary/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New set
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SetDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        set={editingSet || undefined}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">
              Delete set?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the set &quot;{setToDelete?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div>
        {error ? (
          <Card className="p-8">
            <div className="text-center">
              <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-4">
                <div className="text-destructive text-lg">!</div>
              </div>
              <div className="text-destructive font-mono text-sm mb-2">
                {error}
              </div>
              <p className="text-muted-foreground text-sm">
                Try reloading the page
              </p>
            </div>
          </Card>
        ) : sets.length === 0 ? (
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-lg text-foreground mb-2">
                  No sets found
                </h3>
                <p className="text-muted-foreground text-sm">
                  Create your first flashcard set to get started
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create first set
              </Button>
            </div>
          </Card>
        ) : (
          <div className="animate-in fade-in duration-300">
            <SetsGrid sets={sets} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
}
