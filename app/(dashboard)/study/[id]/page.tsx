import { StudyView } from "@/modules/components/study/study-page";
import { setByIdQuery } from "@/modules/data/shared/setsQueryOptions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(setByIdQuery(id));
  } catch (error) {
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudyView setId={id} />
    </HydrationBoundary>
  );
}
