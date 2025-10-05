"use client";

import { useParams } from "next/navigation";
import { StudyInterface } from "@/modules/components/study/study-interface";
import { useSetById } from "@/modules/hooks/use-sets";
import { Card, CardContent } from "@/modules/components/ui/card";
import Link from "next/link";

export default function StudyPage() {
  const params = useParams();
  const setId = parseInt(params['id'] as string, 10);

  const { set, flashcards, error } = useSetById(setId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
              <Link
                href="/sets"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Tilbage til sets
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!set || flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                Ingen flashcards fundet i dette set
              </div>
              <Link
                href="/sets"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Tilbage til sets
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <StudyInterface
      flashcards={flashcards}
      setName={set.name}
      setDifficulty={set.difficulty}
    />
  );
}
