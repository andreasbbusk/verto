"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/modules/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/components/ui/dialog";
import { Label } from "@/modules/components/ui/label";
import { ScrollArea } from "@/modules/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/modules/components/ui/tabs";
import { Textarea } from "@/modules/components/ui/textarea";
import type { CreateFlashcardData } from "@/modules/types/types";
import { toast } from "sonner";
import { FlashcardBatchPreview } from "./flashcard-batch-preview";
import {
  FlashcardJsonImportInput,
  parseJsonFlashcards,
} from "./flashcard-json-import";
import { FLASHCARD_TEXT_LIMIT } from "./flashcard-dialog-constants";
import { useFlashcardFormState } from "./use-flashcard-form-state";

interface FlashcardDialogCreateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkSubmit?: (cards: Omit<CreateFlashcardData, "setId">[]) => Promise<void>;
  isLoading?: boolean;
}

export function FlashcardDialogCreate({
  open,
  onOpenChange,
  onBulkSubmit,
  isLoading = false,
}: FlashcardDialogCreateProps) {
  const [activeTab, setActiveTab] = useState("single");
  const [jsonText, setJsonText] = useState("");
  const [batchCards, setBatchCards] = useState<
    Omit<CreateFlashcardData, "setId">[]
  >([]);
  const {
    formData,
    errors,
    validateForm,
    handleInputChange,
    resetForm,
  } = useFlashcardFormState({ open });

  const jsonParsedResult = useMemo(
    () => parseJsonFlashcards(jsonText),
    [jsonText],
  );
  const jsonParsedCards = jsonParsedResult.cards;
  const jsonParseError = jsonParsedResult.error;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(() => {
        resetForm();
        setJsonText("");
        setBatchCards([]);
        setActiveTab("single");
      }, 200);
    }
    onOpenChange(nextOpen);
  };

  const handleAddToBatch = (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newCard = {
      front: formData.front.trim(),
      back: formData.back.trim(),
      starred: formData.starred,
    };

    setBatchCards((prev) => [...prev, newCard]);
    resetForm();
  };

  const handleRemoveBatchCard = (index: number) => {
    setBatchCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitBatch = async () => {
    if (batchCards.length === 0) {
      toast.error("No cards in batch");
      return;
    }

    if (!onBulkSubmit) {
      toast.error("Bulk submit not supported");
      return;
    }

    try {
      await onBulkSubmit(batchCards);
      toast.success(`${batchCards.length} cards created!`);
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create cards",
      );
    }
  };

  const handleBulkSubmit = async () => {
    const validCards = jsonParsedCards.filter((card) => !card.error);

    if (validCards.length === 0) {
      toast.error("No valid cards to create");
      return;
    }

    if (!onBulkSubmit) {
      toast.error("Bulk submit not supported");
      return;
    }

    try {
      await onBulkSubmit(
        validCards.map((card) => ({
          front: card.front,
          back: card.back,
          starred: card.starred || false,
        })),
      );
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create cards",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-heading-3">
            Create New Flashcards
          </DialogTitle>
          <DialogDescription>
            Choose how you want to add flashcards to your set
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-180px)] pr-4">
          <div className="px-1">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="single">Single</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>

              <TabsContent value="single">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <form onSubmit={handleAddToBatch} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="front"
                          className="text-body-sm font-medium"
                        >
                          Front *
                        </Label>
                        <Textarea
                          id="front"
                          value={formData.front}
                          onChange={handleInputChange("front")}
                          style={{ resize: "none", minHeight: "100px" }}
                          placeholder="Enter a question or prompt for the front"
                          rows={5}
                          className={errors.front ? "border-destructive" : ""}
                          maxLength={FLASHCARD_TEXT_LIMIT}
                        />
                        {errors.front && (
                          <p className="text-xs text-destructive">
                            {errors.front}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formData.front.length}/{FLASHCARD_TEXT_LIMIT} characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="back"
                          className="text-body-sm font-medium"
                        >
                          Back *
                        </Label>
                        <Textarea
                          id="back"
                          value={formData.back}
                          onChange={handleInputChange("back")}
                          placeholder="Enter the answer or explanation for the back"
                          style={{ resize: "none", minHeight: "200px" }}
                          rows={5}
                          className={errors.back ? "border-destructive" : ""}
                          maxLength={FLASHCARD_TEXT_LIMIT}
                        />
                        {errors.back && (
                          <p className="text-xs text-destructive">
                            {errors.back}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formData.back.length}/{FLASHCARD_TEXT_LIMIT} characters
                        </p>
                      </div>
                    </div>

                    <Button variant="secondary" type="submit" className="w-full">
                      Add to preview +
                    </Button>
                  </form>

                  <div className="space-y-4">
                    <FlashcardBatchPreview
                      cards={batchCards.map((card) => ({
                        front: card.front,
                        back: card.back,
                        starred: card.starred,
                      }))}
                      onRemove={handleRemoveBatchCard}
                    />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitBatch}
                    disabled={isLoading || batchCards.length === 0}
                    className="flex-1"
                  >
                    {isLoading
                      ? "Creating..."
                      : `Create ${batchCards.length} cards`}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="json">
                <div className="space-y-4">
                  <FlashcardJsonImportInput
                    value={jsonText}
                    onChange={setJsonText}
                    parsedCards={jsonParsedCards}
                    parseError={jsonParseError}
                  />

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenChange(false)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkSubmit}
                      disabled={
                        isLoading ||
                        jsonParseError !== null ||
                        jsonParsedCards.filter((card) => !card.error).length === 0
                      }
                      className="flex-1"
                    >
                      {isLoading
                        ? "Creating..."
                        : `Create ${jsonParsedCards.filter((card) => !card.error).length} cards`}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export type { FlashcardDialogCreateProps };
