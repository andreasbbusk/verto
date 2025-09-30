"use client";

import { useState } from "react";
import { AnimatedSection } from "@/modules/components/layout/client-wrapper";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/modules/components/ui/table";
import { SetForm } from "./set-form";
import { useSets } from "@/modules/hooks/use-sets";
import type {
  FlashcardSet,
  CreateSetData,
  UpdateSetData,
} from "@/modules/types";
import { ArrowLeft, BookOpen, PlusCircle, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SetsTableProps {
  sets: FlashcardSet[];
  onEdit: (set: FlashcardSet) => void;
  onDelete: (set: FlashcardSet) => void;
}

function SetsTable({ sets, onEdit, onDelete }: SetsTableProps) {
  return (
    <Table className="rounded-lg">
      <TableHeader className="bg-white border border-border/50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="px-6 py-4 text-left text-sm font-semibold text-foreground">
            NAVN
          </TableHead>
          <TableHead className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-foreground">
            KORT
          </TableHead>
          <TableHead className="hidden sm:table-cell px-6 py-4 text-left text-sm font-semibold text-foreground">
            OPRETTET
          </TableHead>
          <TableHead className="px-6 py-4 text-center text-sm font-semibold text-foreground">
            HANDLINGER
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {sets.map((set, index) => (
          <TableRow
            key={set.id}
            className="border-b border-border/30"
            style={{
              animationDelay: `${index * 0.05}s`,
              animation: "fadeInUp 0.5s ease-out forwards",
            }}
          >
            <TableCell className="px-6 py-6">
              <div>
                <Link
                  href={`/sets/${encodeURIComponent(set.name)}`}
                  className="text-lg font-semibold text-foreground hover:text-brand-purple transition-colors duration-200"
                >
                  {set.name}
                </Link>
                <div className="md:hidden mt-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-brand-purple rounded-full" />
                      {set.cardCount} kort
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-brand-gray rounded-full" />
                      {new Date(set.createdAt).toLocaleDateString("da-DK")}
                    </span>
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell px-6 py-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-brand-purple rounded-full" />
                <span className="text-base font-medium text-foreground">
                  {set.cardCount}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell px-6 py-6">
              <span className="text-base text-muted-foreground">
                {new Date(set.createdAt).toLocaleDateString("da-DK")}
              </span>
            </TableCell>
            <TableCell className="px-3 py-6">
              <div className="flex items-center justify-center gap-3">
                <Link href={`/study/${encodeURIComponent(set.name)}`}>
                  <Button
                    size="sm"
                    className="text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg hover:-translate-y-0.5 font-medium"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Studér
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(set)}
                  className="bg-white border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg hover:-translate-y-0.5 font-medium"
                >
                  Rediger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(set)}
                  className="bg-white border-2 border-red-400 text-red-600 hover:bg-red-500 hover:text-white shadow-modern transition-all duration-200 hover:shadow-modern-lg hover:-translate-y-0.5 font-medium"
                >
                  Slet
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function SetsView() {
  const { sets, error, create, update, remove } = useSets();
  const [isCreating, setIsCreating] = useState(false);
  const [editingSet, setEditingSet] = useState<FlashcardSet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: CreateSetData) => {
    try {
      setIsSubmitting(true);
      await create(data);
      setIsCreating(false);
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
      await update({ id: editingSet.id.toString(), data });
      setEditingSet(null);
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


  return (
    <div className="space-y-8">
      {/* Header */}
      <AnimatedSection>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-modern">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Administrer Sets
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Organiser dine flashcard sæt
              </p>
            </div>
            {!isCreating && !editingSet && (
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-brand-purple hover:bg-brand-purple/90 shadow-modern-lg transition-all duration-200 hover:shadow-modern-lg hover:-translate-y-0.5"
                size="lg"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Opret nyt set
              </Button>
            )}
          </div>
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
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-modern">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-red-600 font-bold text-xl">!</div>
                </div>
                <div className="text-red-600 font-semibold text-lg mb-2">
                  {error}
                </div>
                <p className="text-muted-foreground">
                  Prøv at genindlæse siden
                </p>
              </div>
            </CardContent>
          </Card>
        ) : sets.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-modern">
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-brand-purple-light rounded-2xl flex items-center justify-center mx-auto">
                  <BookOpen className="h-10 w-10 text-brand-purple" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-foreground mb-2">
                    Ingen sets fundet
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Start med at oprette dit første flashcard set
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-brand-purple hover:bg-brand-purple/90 shadow-modern-lg"
                  size="lg"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Opret dit første set
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <SetsTable
            sets={sets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </AnimatedSection>
    </div>
  );
}
