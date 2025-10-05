"use client";

import { useState } from "react";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/components/ui/table";
import { SetDialog } from "./set-dialog";
import { useSets } from "@/modules/hooks/use-sets";
import type {
  FlashcardSet,
  CreateSetData,
  UpdateSetData,
} from "@/modules/types";
import { ArrowLeft, BookOpen, PlusCircle, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SetsTableProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

function SetsTable({ sets, onEdit, onDelete }: SetsTableProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="px-4 py-3 text-left font-mono text-xs text-muted-foreground">
              NAME
            </TableHead>
            <TableHead className="hidden md:table-cell px-4 py-3 text-left font-mono text-xs text-muted-foreground">
              CARDS
            </TableHead>
            <TableHead className="hidden sm:table-cell px-4 py-3 text-left font-mono text-xs text-muted-foreground">
              CREATED
            </TableHead>
            <TableHead className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">
              ACTIONS
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set) => (
            <TableRow key={set.id} className="border-b border-border last:border-0 hover:bg-accent">
              <TableCell className="px-4 py-4">
                <div>
                  <Link
                    href={`/sets/${set.id}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {set.name}
                  </Link>
                  <div className="md:hidden mt-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{set.cardCount} cards</span>
                      <span>·</span>
                      <span>{new Date(set.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell px-4 py-4">
                <span className="text-sm text-muted-foreground">
                  {set.cardCount}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell px-4 py-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(set.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </TableCell>
              <TableCell className="px-4 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/study/${set.id}`}>
                    <Button size="sm" variant="ghost">
                      <Play className="h-3 w-3 mr-1" />
                      Study
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(set)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(set)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function SetsView() {
  const { sets, error, loading, create, update, remove } = useSets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      await create(data);
    } catch (error) {
      toast.error("Kunne ikke oprette set");
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
      toast.error("Kunne ikke opdatere set");
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

  const handleDelete = async (set: FlashcardSet) => {
    try {
      await remove(set.id);
      toast.success("Set slettet!");
    } catch (error) {
      toast.error("Kunne ikke slette set");
    }
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingSet(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div>
            <h1 className="font-mono text-4xl font-bold text-foreground tracking-tight">
              Sets
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Manage your flashcard sets
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Set
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <SetDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        set={editingSet || undefined}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

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
        ) : loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-6 h-6 border border-foreground border-t-transparent rounded-full animate-spin"></div>
          </div>
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
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Set
              </Button>
            </div>
          </Card>
        ) : (
          <SetsTable sets={sets} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
