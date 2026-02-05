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
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import { cn } from "@/modules/lib/utils";
import type { Flashcard as FlashcardData } from "@/modules/types/types";
import { motion } from "framer-motion";
import { Pencil, Star } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useFlashcardFlip } from "./use-flashcard-flip";

interface FlashcardCardProps {
  flashcard?: FlashcardData | null;
  isFlipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  className?: string;
  onEdit?: (flashcard: FlashcardData) => void;
  onToggleStar?: (flashcard: FlashcardData) => void;
  earmarkNumber?: number;
  earmarkLabel?: string;
}

interface FlashcardCardEditableProps {
  flashcard?: FlashcardData | null;
  className?: string;
  onEdit?: (flashcard: FlashcardData) => void;
  onDelete?: (flashcard: FlashcardData) => void;
  onToggleStar?: (flashcard: FlashcardData) => void;
}

interface FlashcardFaceProps {
  rotation: number;
  content: string;
  earmark?: ReactNode;
  actions?: ReactNode;
}

function FlashcardCardEmpty({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card rounded-lg border-2 border-border p-8 w-full max-w-md mx-auto",
        className,
      )}
    >
      <p className="text-muted-foreground text-center font-medium">
        No flashcard data available
      </p>
    </motion.div>
  );
}

function FlashcardEarmark({
  number,
  label,
}: {
  number?: number;
  label?: string;
}) {
  if (number === undefined) {
    return null;
  }

  return (
    <div className="absolute top-3 left-3 z-10 rounded-full border border-border/80 bg-muted/80 px-2.5 py-1 text-xs font-mono text-foreground">
      <span>{number}</span>
      {label && (
        <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

function FlashcardActionButtons({
  flashcard,
  onEdit,
  onToggleStar,
}: {
  flashcard: FlashcardData;
  onEdit?: (flashcard: FlashcardData) => void;
  onToggleStar?: (flashcard: FlashcardData) => void;
}) {
  if (!onEdit && !onToggleStar) {
    return null;
  }

  return (
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
  );
}

function FlashcardFace({
  rotation,
  content,
  earmark,
  actions,
}: FlashcardFaceProps) {
  return (
    <motion.div
      style={{
        backfaceVisibility: "hidden",
        transform: `rotateY(${rotation}deg)`,
      }}
      className="absolute inset-0 w-full h-full rounded-2xl bg-primary shadow-3d-md p-8 flex flex-col justify-between"
    >
      {earmark}
      {actions}

      <motion.div
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-primary-foreground text-xl font-bold text-center leading-relaxed">
          {content}
        </p>
      </motion.div>

      <motion.div
        className="flex justify-center items-center space-x-2 text-primary-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </motion.div>
  );
}

export function FlashcardCard({
  flashcard,
  isFlipped = false,
  onFlip,
  className,
  onEdit,
  onToggleStar,
  earmarkNumber,
  earmarkLabel,
}: FlashcardCardProps) {
  const { flipped, toggle } = useFlashcardFlip({ isFlipped, onFlip });

  if (!flashcard) {
    return <FlashcardCardEmpty className={className} />;
  }

  const renderEarmark = () => (
    <FlashcardEarmark number={earmarkNumber} label={earmarkLabel} />
  );
  const renderActions = () => (
    <FlashcardActionButtons
      flashcard={flashcard}
      onEdit={onEdit}
      onToggleStar={onToggleStar}
    />
  );

  return (
    <div className={cn("perspective-1500 w-full max-w-md mx-auto", className)}>
      <motion.div
        onClick={toggle}
        animate={{
          rotateY: flipped ? 180 : 0,
          scale: flipped ? [1, 1.02, 1] : [1, 1.02, 1],
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0.0, 0.2, 1],
          scale: { duration: 0.8, ease: [0.4, 0.0, 0.2, 1] },
        }}
        style={{ transformStyle: "preserve-3d" }}
        className={cn(
          "relative w-full h-80 rounded-xl transition-shadow duration-300 cursor-pointer",
          flipped ? "shadow-3d-lg" : "shadow-3d-md",
        )}
      >
        <FlashcardFace
          rotation={0}
          content={flashcard.front}
          earmark={renderEarmark()}
          actions={renderActions()}
        />
        <FlashcardFace
          rotation={180}
          content={flashcard.back}
          earmark={renderEarmark()}
          actions={renderActions()}
        />
      </motion.div>
    </div>
  );
}

export function FlashcardCardEditable({
  flashcard,
  className,
  onEdit,
  onDelete,
  onToggleStar,
}: FlashcardCardEditableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!flashcard) {
    return <FlashcardCardEmpty className={className} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-2xl border border-foreground/20 overflow-hidden h-[280px] flex flex-col",
        className,
      )}
    >
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide mb-1">
                Front
              </p>
              <p className="text-foreground text-base font-semibold leading-relaxed">
                {flashcard.front}
              </p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="text-[11px] text-muted-foreground font-mono uppercase tracking-wide mb-1">
                Back
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {flashcard.back}
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="px-4 py-3 bg-muted/20 border-t border-border/40 flex items-center justify-between shrink-0">
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
                flashcard.starred ? "text-primary" : "text-muted-foreground",
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
                      Are you sure you want to delete this flashcard? This
                      action cannot be undone.
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

export type { FlashcardCardEditableProps, FlashcardCardProps };

