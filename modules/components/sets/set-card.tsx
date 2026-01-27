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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/modules/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/modules/components/ui/tooltip";
import type { FlashcardSet } from "@/modules/types/types";
import { BookOpen, Edit, Play, Trash2 } from "lucide-react";
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

  return (
    <>
      <Card
        className="group hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col h-full cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                  {set.name}
                </h3>
                {set.difficulty && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs font-mono text-primary/60 bg-primary/10 px-1.5 py-0.5 rounded flex-shrink-0 cursor-pointer">
                        {set.difficulty}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Difficulty: {set.difficulty}/5</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className="w-10 h-10 border border-border flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="font-mono text-xs">
                {set.cardCount} kort
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              Created: {new Date(set.createdAt).toLocaleDateString("en-US")}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t border-border">
          <div className="flex w-full gap-2" onClick={(e) => e.stopPropagation()}>
            <Link href={`/study/${set.id}`} className="flex-1">
              <Button className="w-full" size="sm">
                <Play className="h-3 w-3 mr-2" />
                Studer
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
            <AlertDialogTitle className="font-mono">Slet set?</AlertDialogTitle>
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
              Slet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
