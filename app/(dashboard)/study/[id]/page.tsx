import Link from "next/link";
import { StudyInterface } from "@/modules/components/study/study-interface";
import { Card, CardContent } from "@/modules/components/ui/card";
import { getSetById } from "@/modules/server/actions/sets";
import { notFound } from "next/navigation";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  let set: Awaited<ReturnType<typeof getSetById>> | null = null;
  try {
    set = await getSetById(id);
  } catch {
    notFound();
  }

  const flashcards = set?.flashcards ?? [];
  if (!set || flashcards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                No flashcards found in this set
              </div>
              <Link
                href="/sets"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Back to sets
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
      setId={id}
    />
  );
}
