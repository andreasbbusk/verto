"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/modules/components/ui/badge";
import { Button } from "@/modules/components/ui/button";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
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
import type { Flashcard } from "@/modules/types";

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
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === " "
      ) {
        event.preventDefault();
        setFlipped(!flipped);
      }
    };

    const cardElement = cardRef.current;
    if (cardElement && !editMode) {
      cardElement.focus();
      cardElement.addEventListener("keydown", handleKeyDown);

      return () => {
        cardElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [editMode, flipped, setFlipped]);

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
          Ingen flashcard data tilgængelig
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
                Rediger
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
                  Slet
                </Button>
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Slet flashcard?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Er du sikker på du vil slette dette flashcard. Denne handling kan ikke
                        fortrydes.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuller</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete(flashcard);
                          setDeleteDialogOpen(false);
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Slet
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
    <div className={cn("perspective-1000 w-full max-w-md mx-auto", className)}>
      <motion.div
        ref={cardRef}
        tabIndex={editMode ? -1 : 0}
        onClick={handleClick}
        animate={{ rotateX: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className={cn(
          "relative w-full h-64 outline-none focus:outline-none rounded-xl",
          !editMode && "cursor-pointer"
        )}
      >
        {/* Front Side */}
        <motion.div
          style={{ backfaceVisibility: "hidden", transform: "rotateX(0deg)" }}
          className="absolute inset-0 w-full h-full rounded-2xl bg-primary shadow-modern-lg p-8 flex flex-col justify-between"
        >
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
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
          className="absolute inset-0 w-full h-full rounded-2xl bg-primary shadow-modern-lg p-8 flex flex-col justify-between"
        >
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
