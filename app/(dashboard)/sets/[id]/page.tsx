import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { SetDetailView } from "@/modules/components/sets/detail/set-detail-view";
import { setByIdQuery } from "@/modules/data/shared/setsQueryOptions";

interface SetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SetDetailPage({ params }: SetDetailPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery(setByIdQuery(id));
  } catch (error) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SetDetailView setId={id} />
    </HydrationBoundary>
  );
}
