import { getSetById } from "@/modules/actions/sets";
import { StudyView } from "@/modules/components/study/study-page";
import { Card, CardContent } from "@/modules/components/ui/card";
import Link from "next/link";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                Ugyldigt set ID
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

  try {
    const set = await getSetById(id);
    return <StudyView initialSet={set} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error instanceof Error ? error.message : "Kunne ikke hente set"}
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
}
