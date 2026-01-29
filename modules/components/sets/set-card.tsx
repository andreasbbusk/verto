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
import { Card, CardFooter } from "@/modules/components/ui/card";
import { usePrefetchSetById } from "@/modules/data/client/hooks/queries/useSets.client";
import type { FlashcardSet } from "@/modules/types/types";
import { Edit, Play, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SetCardProps {
  set: FlashcardSet;
  onEdit?: (set: FlashcardSet) => void;
  onDelete?: (set: FlashcardSet) => void;
  showActions?: boolean;
}

export function SetCard({
  set,
  onEdit,
  onDelete,
  showActions = true,
}: SetCardProps) {
  const router = useRouter();
  const prefetchSetById = usePrefetchSetById();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(set);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete?.(set);
    setDeleteDialogOpen(false);
  };

  const handleCardClick = () => {
    router.push(`/sets/${set.id}`);
  };

  const handlePrefetch = () => {
    prefetchSetById(set.id);
    router.prefetch(`/sets/${set.id}`);
    router.prefetch(`/study/${set.id}`);
  };

  return (
    <>
      <Card
        className="group h-full cursor-pointer overflow-hidden p-0 gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#111111]"
        onClick={handleCardClick}
        onMouseEnter={handlePrefetch}
      >
        <div className="flex min-h-[160px]">
          <div className="w-1.5 bg-primary" />

          <div className="flex-1 px-6 py-6">
            <h3 className="font-mono text-lg font-bold text-foreground truncate">
              {set.name}
            </h3>

            <div className="mt-2 min-h-[40px]">
              {set.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {set.description}
                </p>
              )}
            </div>

            <div className="mt-4 space-y-1 text-xs font-mono text-muted-foreground">
              <div>
                <span className="text-foreground">{set.cardCount}</span>
                <span className="ml-1">cards</span>
              </div>
              {typeof set.totalReviews === "number" && (
                <div>
                  <span className="text-foreground">{set.totalReviews}</span>
                  <span className="ml-1">reviews</span>
                </div>
              )}
              <div>Created {new Date(set.createdAt).toLocaleDateString("en-US")}</div>
              {set.difficulty && <div>Difficulty {set.difficulty}/5</div>}
            </div>
          </div>
        </div>

        <CardFooter className="border-t border-foreground/10 pt-4 pb-4">
          <div className="flex w-full gap-2" onClick={(e) => e.stopPropagation()}>
            <Link href={`/study/${set.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                <Play className="h-3 w-3 mr-2" />
                Study
              </Button>
            </Link>

            {showActions && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="px-3"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="px-3 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Delete set?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the set &quot;{set.name}&quot;? This action cannot be undone.
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
