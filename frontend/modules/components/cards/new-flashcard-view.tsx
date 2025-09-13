"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/components/ui/button";
import { FlashcardForm } from "@/modules/components/flashcards/flashcard-form";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { createFlashcard } from "@/modules/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { CreateFlashcardData, UpdateFlashcardData } from "@/modules/types";

export function NewFlashcardView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (data: CreateFlashcardData) => {
    try {
      setIsSubmitting(true);
      await createFlashcard(data);
      toast.success("Flashcard oprettet!");
      router.push("/cards");
    } catch (error) {
      toast.error("Kunne ikke oprette flashcard");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async (data: CreateFlashcardData | UpdateFlashcardData) => {
    await handleCreate(data as CreateFlashcardData);
  };

  const handleCancel = () => {
    router.push("/cards");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center space-x-4">
          <Link href="/cards">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbage til flashcards
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Opret Nyt Flashcard
            </h1>
            <p className="text-gray-600 mt-1">
              Tilføj et nyt flashcard til din samling
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Form */}
      <AnimatedSection delay={0.1}>
        <FlashcardForm
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </AnimatedSection>
    </div>
  );
}