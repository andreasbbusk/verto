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
import { BookOpen, Play, PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { SetDialogCreate } from "../dialog/set-dialog-create";
import { SetDialogEdit } from "../dialog/set-dialog-edit";
import { SetCardGrid } from "./list/set-card-grid";
import { useSetsContext } from "./sets-context";

export function SetsHeader() {
  const {
    actions: { openCreateDialog },
  } = useSetsContext();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
            Flashcard sets
          </h1>
          <p className="text-muted-foreground text-sm">Manage your sets here.</p>
        </div>
        <Button
          onClick={openCreateDialog}
          size="sm"
          className="w-full transition-all hover:shadow-md hover:shadow-primary/20 lg:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New set
        </Button>
      </div>
      <div className="h-px w-full bg-border" />
    </div>
  );
}

export function SetsDialogs() {
  const {
    state: {
      dialogOpen,
      editingSet,
      isSubmitting,
      deleteDialogOpen,
      setToDelete,
    },
    actions: {
      handleDialogChange,
      handleCreate,
      handleUpdate,
      handleDeleteDialogChange,
      confirmDelete,
    },
  } = useSetsContext();

  return (
    <>
      {editingSet ? (
        <SetDialogEdit
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          set={editingSet}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
        />
      ) : (
        <SetDialogCreate
          open={dialogOpen}
          onOpenChange={handleDialogChange}
          onSubmit={handleCreate}
          isLoading={isSubmitting}
        />
      )}

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Delete set?</AlertDialogTitle>
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
    </>
  );
}

export function SetsContent() {
  const {
    state: { sets, error, continueStudy },
    actions: { prefetchSetById, dismissContinue, openCreateDialog, openEditDialog, requestDelete },
  } = useSetsContext();

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-12 h-12 border border-destructive flex items-center justify-center mx-auto mb-4">
            <div className="text-destructive text-lg">!</div>
          </div>
          <div className="text-destructive font-mono text-sm mb-2">{error}</div>
          <p className="text-muted-foreground text-sm">Try reloading the page</p>
        </div>
      </Card>
    );
  }

  if (sets.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border border-border flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-lg text-foreground mb-2">
              Create your first set
            </h3>
            <p className="text-muted-foreground text-sm">
              Build a focused deck and start studying in minutes.
            </p>
          </div>
          <Button onClick={openCreateDialog} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            New set
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="space-y-6">
        {continueStudy?.set && (
          <Card className="p-3 w-full sm:max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div>
                  <p className="text-xs text-muted-foreground">Continue studying</p>
                  <p className="font-mono text-sm text-foreground">
                    {continueStudy.set.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/study/${continueStudy.set.id}`}
                  onMouseEnter={() => prefetchSetById(continueStudy.set.id)}
                >
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissContinue(continueStudy.set.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        <SetCardGrid sets={sets} onEdit={openEditDialog} onDelete={requestDelete} />
      </div>
    </div>
  );
}
