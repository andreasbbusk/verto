"use client";

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
import { useSets } from "@/modules/data/client/hooks/queries/useSets.client";
import type {
  CreateFlashcardData,
  Flashcard,
  UpdateFlashcardData,
} from "@/modules/types/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { JsonImportInput, parseJsonFlashcards } from "./json-import-input";
import { CardPreviewList } from "./card-preview-list";

interface FlashcardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flashcard?: Flashcard;
  onSubmit?: (data: CreateFlashcardData | UpdateFlashcardData) => Promise<void>;
  onBulkSubmit?: (cards: Omit<CreateFlashcardData, "setId">[]) => Promise<void>;
  isLoading?: boolean;
  mode?: "create" | "edit" | "select-set";
}

export function FlashcardDialog({
  open,
  onOpenChange,
  flashcard,
  onSubmit,
  onBulkSubmit,
  isLoading = false,
  mode = "create",
}: FlashcardDialogProps) {
  const cardTextLimit = 300;
  const router = useRouter();
  const { sets } = useSets();
  const [activeTab, setActiveTab] = useState("single");
  const [formData, setFormData] = useState({
    front: flashcard?.front || "",
    back: flashcard?.back || "",
    starred: flashcard?.starred || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jsonText, setJsonText] = useState("");
  const [batchCards, setBatchCards] = useState<
    Omit<CreateFlashcardData, "setId">[]
  >([]);

  const jsonParsedResult = useMemo(
    () => parseJsonFlashcards(jsonText),
    [jsonText],
  );
  const jsonParsedCards = jsonParsedResult.cards;
  const jsonParseError = jsonParsedResult.error;

  const handleSelectSet = (setId: string) => {
    router.push(`/sets/${setId}?createCard=true`);
    onOpenChange(false);
  };

  // Update form data when flashcard changes (for edit mode)
  useEffect(() => {
    if (flashcard && open) {
      setFormData({
        front: flashcard.front,
        back: flashcard.back,
        starred: flashcard.starred || false,
      });
    }
  }, [flashcard, open]);

  // Reset form when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Delay reset to avoid flickering during close animation
      setTimeout(() => {
        setFormData({
          front: "",
          back: "",
          starred: false,
        });
        setErrors({});
        setJsonText("");
        setBatchCards([]);
        setActiveTab("single");
      }, 200);
    }
    onOpenChange(newOpen);
  };

  // Show set selection mode
  if (mode === "select-set") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a set</DialogTitle>
            <DialogDescription>
              Choose which set you want to add a new card to
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {sets.length === 0 ? (
              <div className="text-center p-8 text-sm text-muted-foreground">
                No sets found. Create a set first.
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {sets.map((set) => (
                    <Button
                      key={set.id}
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                      onClick={() => handleSelectSet(set.id)}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium text-sm">{set.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {set.cardCount || 0} cards
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.front.trim()) {
      newErrors.front = "Front is required";
    }

    if (!formData.back.trim()) {
      newErrors.back = "Back is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToBatch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newCard = {
      front: formData.front.trim(),
      back: formData.back.trim(),
      starred: formData.starred,
    };

    setBatchCards((prev) => [...prev, newCard]);

    // Reset form
    setFormData({
      front: "",
      back: "",
      starred: false,
    });
    setErrors({});
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors and try again");
      return;
    }

    if (!onSubmit) {
      toast.error("No submit handler provided");
      return;
    }

    try {
      await onSubmit({
        front: formData.front.trim(),
        back: formData.back.trim(),
        starred: formData.starred,
      });
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save flashcard",
      );
    }
  };

  const handleBulkSubmit = async () => {
    const validCards = jsonParsedCards.filter((c) => !c.error);

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
        validCards.map((c) => ({
          front: c.front,
          back: c.back,
          starred: c.starred || false,
        })),
      );
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create cards",
      );
    }
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  // Edit mode: show single card form only (no tabs)
  if (flashcard) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-heading-3">
              Edit Flashcard
            </DialogTitle>
            <DialogDescription>Update your flashcard</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="front" className="text-body-sm font-medium">
                Front *
              </Label>
              <Textarea
                id="front"
                value={formData.front}
                onChange={handleInputChange("front")}
                placeholder="Enter a question or prompt for the front"
                rows={3}
                className={errors.front ? "border-destructive" : ""}
                maxLength={cardTextLimit}
              />
              {errors.front && (
                <p className="text-xs text-destructive">{errors.front}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.front.length}/{cardTextLimit} characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="back" className="text-body-sm font-medium">
                Back *
              </Label>
              <Textarea
                id="back"
                value={formData.back}
                onChange={handleInputChange("back")}
                placeholder="Enter the answer or explanation for the back"
                rows={3}
                className={errors.back ? "border-destructive" : ""}
                maxLength={cardTextLimit}
              />
              {errors.back && (
                <p className="text-xs text-destructive">{errors.back}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.back.length}/{cardTextLimit} characters
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Update Flashcard"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Create mode: show tabs for different input methods
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
                  {/* Left: Form */}
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
                        maxLength={cardTextLimit}
                      />
                      {errors.front && (
                        <p className="text-xs text-destructive">
                          {errors.front}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.front.length}/{cardTextLimit} characters
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
                        maxLength={cardTextLimit}
                      />
                      {errors.back && (
                        <p className="text-xs text-destructive">
                          {errors.back}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.back.length}/{cardTextLimit} characters
                      </p>
                    </div>
                    </div>

                    <Button variant="secondary" type="submit" className="w-full">
                      Add to preview +
                    </Button>
                  </form>

                  {/* Right: Preview */}
                  <div className="space-y-4">
                    <CardPreviewList
                      cards={batchCards.map((card) => ({
                        front: card.front,
                        back: card.back,
                        starred: card.starred,
                      }))}
                      onRemove={handleRemoveBatchCard}
                    />
                  </div>
                </div>

                {/* Bottom actions */}
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
                  <JsonImportInput
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
                        jsonParsedCards.filter((c) => !c.error).length === 0
                      }
                      className="flex-1"
                    >
                      {isLoading
                        ? "Creating..."
                        : `Create ${jsonParsedCards.filter((c) => !c.error).length} cards`}
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
