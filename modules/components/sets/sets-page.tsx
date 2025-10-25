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
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { Card } from "@/modules/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/components/ui/table";
import { useSets } from "@/modules/hooks/use-sets";
import { cn } from "@/modules/lib/utils";
import { useViewStore } from "@/modules/stores/view.store";
import type {
  CreateSetData,
  FlashcardSet,
  UpdateSetData,
} from "@/modules/types";
import {
  BookOpen,
  Edit,
  LayoutGrid,
  LayoutList,
  Play,
  PlusCircle,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SetCard } from "./set-card";
import { SetDialog } from "./set-dialog";
import { Loader } from "@/modules/components/ui/loader";

interface SetsTableProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

function SetsTable({ sets, onEdit, onDelete }: SetsTableProps) {
  const router = useRouter();

  const handleRowClick = (setId: number) => {
    router.push(`/sets/${setId}`);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="px-6 py-3 text-left font-mono text-xs text-muted-foreground uppercase tracking-wide">
              Navn
            </TableHead>
            <TableHead className="hidden md:table-cell px-4 py-3 text-left font-mono text-xs text-muted-foreground uppercase tracking-wide">
              Kort
            </TableHead>
            <TableHead className="hidden lg:table-cell px-4 py-3 text-left font-mono text-xs text-muted-foreground uppercase tracking-wide">
              Oprettet
            </TableHead>
            <TableHead className="px-6 py-3 text-right font-mono text-xs text-muted-foreground uppercase tracking-wide">
              Handlinger
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sets.map((set, index) => (
            <TableRow
              key={set.id}
              onClick={() => handleRowClick(set.id)}
              className={cn(
                "border-b border-border last:border-0 cursor-pointer transition-all animate-in fade-in group",
                "hover:bg-accent/50 "
              )}
              style={{
                animationDelay: `${index * 30}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Name Column */}
              <TableCell className="px-6 py-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {set.starred && (
                      <Star className="h-4 w-4 text-primary fill-primary flex-shrink-0" />
                    )}
                    <h3 className="text-base font-mono font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {set.name}
                    </h3>
                    {set.difficulty && (
                      <Badge
                        variant="outline"
                        className="font-mono text-xs flex-shrink-0"
                      >
                        Lvl {set.difficulty}
                      </Badge>
                    )}
                  </div>
                  {set.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {set.description}
                    </p>
                  )}
                  {/* Mobile meta */}
                  <div className="md:hidden flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {set.cardCount}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(set.createdAt).toLocaleDateString("da-DK", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* Card Count Column */}
              <TableCell className="hidden md:table-cell px-4 py-5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-foreground">
                    {set.cardCount}
                  </span>
                </div>
              </TableCell>

              {/* Created Column */}
              <TableCell className="hidden lg:table-cell px-4 py-5">
                <span className="text-sm font-mono text-muted-foreground">
                  {new Date(set.createdAt).toLocaleDateString("da-DK", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </TableCell>

              {/* Actions Column */}
              <TableCell className="px-6 py-5">
                <div
                  className="flex items-center justify-end gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link href={`/study/${set.id}`}>
                    <Button size="sm" variant="default" className="h-8">
                      <Play className="h-3 w-3 mr-1.5" />
                      <span className="hidden sm:inline">Studer</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(set)}
                    className="h-8 w-8 p-0"
                    title="Rediger sæt"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(set)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    title="Slet sæt"
                  >
                    <Trash2 className="h-4 w-4" />
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

interface SetsViewProps {
  initialSets: FlashcardSet[];
}

export function SetsView({ initialSets }: SetsViewProps) {
  const searchParams = useSearchParams();
  const { sets, isLoading, error, create, update, remove } = useSets(initialSets);
  const { setsView, setSetsView } = useViewStore();
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

  const handleDelete = (set: FlashcardSet) => {
    setSetToDelete(set);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!setToDelete) return;

    try {
      await remove(setToDelete.id);
      toast.success("Set slettet!");
      setDeleteDialogOpen(false);
      setSetToDelete(null);
    } catch (error) {
      toast.error("Kunne ikke slette set");
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
              Flashcard sæt
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Administrér dine sæt her.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <Button
              onClick={() => setDialogOpen(true)}
              size="sm"
              className="transition-all hover:shadow-md hover:shadow-primary/20"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nyt sæt
            </Button>
            <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-card">
              <Button
                variant={setsView === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSetsView("grid")}
                className="px-3 transition-all"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={setsView === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSetsView("table")}
                className="px-3 transition-all"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
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
            <AlertDialogTitle className="font-mono">Slet set?</AlertDialogTitle>
            <AlertDialogDescription>
              Er du sikker på du vil slette set &quot;{setToDelete?.name}&quot;?
              Denne handling kan ikke fortrydes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuller</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slet
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
                Prøv at genindlæse siden
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
                  Ingen sæt fundet
                </h3>
                <p className="text-muted-foreground text-sm">
                  Opret dit første flashcard-sæt for at komme i gang
                </p>
              </div>
              <Button onClick={() => setDialogOpen(true)} size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Opret første sæt
              </Button>
            </div>
          </Card>
        ) : (
          <div key={setsView} className="animate-in fade-in duration-300">
            {setsView === "table" ? (
              <SetsTable
                sets={sets}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <SetsGrid
                sets={sets}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
