"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import { Pencil, Star } from "lucide-react";
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
import { cn } from "@/modules/lib/utils";
import type { Flashcard } from "@/modules/types/types";

interface FlashcardProps {
  flashcard: Flashcard | null;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  className?: string;
  showEditButton?: boolean;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (flashcard: Flashcard) => void;
  onToggleStar?: (flashcard: Flashcard) => void;
  editMode?: boolean;
}

const FlashcardComponent = ({
  flashcard,
  isFlipped = false,
  onFlip,
  className,
  showEditButton = false,
  onEdit,
  onDelete,
  onToggleStar,
  editMode = false,
}: FlashcardProps) => {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const flipped = onFlip !== undefined ? isFlipped : internalFlipped;
  const setFlipped = onFlip !== undefined ? onFlip : setInternalFlipped;

  const handleClick = () => {
    if (!editMode) {
      setFlipped(!flipped);
    }
  };

  if (!flashcard) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-card rounded-lg border-2 border-border p-8 w-full max-w-md mx-auto",
          className
        )}
      >
        <p className="text-muted-foreground text-center font-medium">
          No flashcard data available
        </p>
      </motion.div>
    );
  }

  // Edit mode: show static card with front/back and actions
  if (editMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "bg-card rounded-lg border-2 border-border overflow-hidden h-[280px] flex flex-col",
          className
        )}
      >
        {/* Card Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {/* Front Side */}
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">
                  Forside
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  {flashcard.front}
                </p>
              </div>

              {/* Back Side */}
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">
                  Bagside
                </p>
                <p className="text-foreground/75 font-medium leading-relaxed">
                  {flashcard.back}
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Card Footer - Fixed */}
        <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between flex-shrink-0">
          {onToggleStar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard);
              }}
              className="h-7 px-2 -ml-2"
            >
              <span
                className={cn(
                  "text-base",
                  flashcard.starred ? "text-primary" : "text-muted-foreground"
                )}
              >
                {flashcard.starred ? "★" : "☆"}
              </span>
            </Button>
          )}
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(flashcard);
                }}
                className="h-7 text-xs px-3"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                  className="h-7 text-xs px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                        Delete

                </Button>
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete flashcard?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this flashcard? This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(flashcard);
                          setDeleteDialogOpen(false);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                  Delete

                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn("perspective-1500 w-full max-w-md mx-auto", className)}>
      <motion.div
        onClick={handleClick}
        animate={{ 
          rotateY: flipped ? 180 : 0,
          scale: flipped ? [1, 1.02, 1] : [1, 1.02, 1],
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.4, 0.0, 0.2, 1],
          scale: { duration: 0.8, ease: [0.4, 0.0, 0.2, 1] }
        }}
        style={{ transformStyle: "preserve-3d" }}
        className={cn(
          "relative w-full h-80 rounded-xl transition-shadow duration-300",
          !editMode && "cursor-pointer",
          flipped ? "shadow-3d-lg" : "shadow-3d-md"
        )}
      >
        {/* Front Side */}
        <motion.div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          className="absolute inset-0 w-full h-full rounded-2xl bg-primary shadow-3d-md p-8 flex flex-col justify-between"
        >
          {/* Action buttons */}
          {(showEditButton || onEdit || onToggleStar) && (
            <div className="absolute top-3 right-3 flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(flashcard);
                  }}
                  className="h-8 w-8 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                  title="Edit card (E)"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onToggleStar && (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(flashcard);
                  }}
                  className="h-8 w-8 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                  title="Add to favorites (F)"
                >
                  <Star
                    className="h-4 w-4"
                    fill={flashcard.starred ? "currentColor" : "none"}
                  />
                </Button>
              )}
            </div>
          )}

          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-primary-foreground text-xl font-bold text-center leading-relaxed">
              {flashcard.front}
            </p>
          </motion.div>

          {!editMode && (
            <motion.div
              className="flex justify-center items-center space-x-2 text-primary-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm">Click or use ↑ ↓ to flip</span>
            </motion.div>
          )}
        </motion.div>

        {/* Back Side */}
        <motion.div
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          className="absolute inset-0 w-full h-full rounded-2xl bg-primary shadow-3d-md p-8 flex flex-col justify-between"
        >
          {/* Action buttons */}
          {(showEditButton || onEdit || onToggleStar) && (
            <div className="absolute top-3 right-3 flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(flashcard);
                  }}
                  className="h-8 w-8 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                  title="Edit card (E)"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onToggleStar && (
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(flashcard);
                  }}
                  className="h-8 w-8 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                  title="Add to favorites (F)"
                >
                  <Star
                    className="h-4 w-4"
                    fill={flashcard.starred ? "currentColor" : "none"}
                  />
                </Button>
              )}
            </div>
          )}

          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-primary-foreground text-xl font-bold text-center leading-relaxed">
              {flashcard.back}
            </p>
          </motion.div>

          {!editMode && (
            <motion.div
              className="flex justify-center items-center space-x-2 text-primary-foreground/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-sm">Click or use ↑ ↓ to flip</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlashcardComponent;
export type { Flashcard, FlashcardProps };
