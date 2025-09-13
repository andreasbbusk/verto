"use client";

import { useState } from "react";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { SetForm } from "./set-form";
import { useSets } from "@/modules/hooks/use-sets";
import type { FlashcardSet, CreateSetData, UpdateSetData } from "@/modules/types";
import { ArrowLeft, BookOpen, PlusCircle, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SetsTableProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

function SetsTable({ sets, onEdit, onDelete }: SetsTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Navn
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kort
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oprettet
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sets.map((set) => (
              <tr key={set.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <Link
                      href={`/sets/${encodeURIComponent(set.name)}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {set.name}
                    </Link>
                    <div className="md:hidden mt-1">
                      <p className="text-xs text-gray-400">
                        {set.cardCount} kort •{" "}
                        {new Date(set.createdAt).toLocaleDateString("da-DK")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {set.cardCount}
                </td>
                <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(set.createdAt).toLocaleDateString("da-DK")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link href={`/study/${encodeURIComponent(set.name)}`}>
                    <Button
                      variant="default"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Studér
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(set)}
                  >
                    Rediger
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(set)}
                  >
                    Slet
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function SetsView() {
  const { sets, loading, error, create, update, remove } = useSets();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      await create(data);
      setIsCreating(false);
      toast.success("Set oprettet!");
    } catch (error) {
      toast.error("Kunne ikke oprette set");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: UpdateSetData) => {
    if (!editingSet) return;
    
    try {
      setIsSubmitting(true);
      await update(editingSet.id.toString(), data);
      setEditingSet(null);
      toast.success("Set opdateret!");
    } catch (error) {
      toast.error("Kunne ikke opdatere set");
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
    setIsCreating(false);
  };

  const handleDelete = async (set: FlashcardSet) => {
    try {
      await remove(set.id.toString());
      toast.success("Set slettet!");
    } catch (error) {
      toast.error("Kunne ikke slette set");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingSet(null);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Indlæser sets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tilbage til dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Administrer Sets
                </h1>
                <p className="text-gray-600 mt-1">
                  Organiser dine flashcard sæt
                </p>
              </div>
            </div>
            {!isCreating && !editingSet && (
              <Button onClick={() => setIsCreating(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Opret nyt set
              </Button>
            )}
          </div>
        </AnimatedSection>

        {/* Form */}
        {(isCreating || editingSet) && (
          <AnimatedSection delay={0.2}>
            <SetForm
              set={editingSet || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </AnimatedSection>
        )}

        {/* Content */}
        <AnimatedSection delay={0.3}>
          {error ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-red-600 font-medium mb-2">{error}</div>
                  <p className="text-gray-500 text-sm">
                    Prøv at genindlæse siden
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : sets.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Ingen sets fundet</h3>
                    <p className="text-gray-500">
                      Start med at oprette dit første flashcard set
                    </p>
                  </div>
                  <Button onClick={() => setIsCreating(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Opret dit første set
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SetsTable sets={sets} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </AnimatedSection>
    </div>
  );
}
