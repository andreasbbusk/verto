"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/modules/components/ui/button";
import { SetForm } from "./set-form";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { createSet } from "@/modules/api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { CreateSetData } from "@/modules/types";

export function NewSetView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      const response = await createSet(data);
      toast.success("Set oprettet!");
      router.push("/sets");
    } catch (error) {
      toast.error("Kunne ikke oprette set");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/sets");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center space-x-4">
          <Link href="/sets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tilbage til sets
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Opret Nyt Set
            </h1>
            <p className="text-gray-600 mt-1">
              Opret et nyt flashcard set til at organisere dine kort
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Form */}
      <AnimatedSection delay={0.1}>
        <SetForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </AnimatedSection>
    </div>
  );
}