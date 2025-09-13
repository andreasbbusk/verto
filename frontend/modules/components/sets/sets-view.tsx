"use client";

import { useEffect, useState } from "react";
import {
  ActionButton,
  AnimatedSection,
} from "@/modules/components/layout/client-wrapper";
import { Button } from "@/modules/components/ui/button";
import { Card, CardContent } from "@/modules/components/ui/card";
import { getSets } from "@/modules/api";
import type { FlashcardSet } from "@/modules/types";
import { ArrowLeft, BookOpen, PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface SetsTableProps {
  sets: FlashcardSet[];
}

function SetsTable({ sets }: SetsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      href={`/study/${encodeURIComponent(set.name)}`}
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
                  <ActionButton
                    item={{ id: set.id.toString(), name: set.name }}
                    action="Edit"
                  />
                  <ActionButton
                    item={{ id: set.id.toString(), name: set.name }}
                    action="Delete"
                    variant="destructive"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SetsView() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedSets = await getSets();
        setSets(fetchedSets);
      } catch (err) {
        setError("Kunne ikke hente sets");
        console.error("Error fetching sets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading sets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <Link href="/sets/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Opret nyt set
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        {/* Content */}
        <AnimatedSection delay={0.2}>
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
                  <Link href="/sets/new">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Opret dit første set
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SetsTable sets={sets} />
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
