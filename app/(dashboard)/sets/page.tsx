import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { SetsView } from "@/modules/components/sets/sets-page";
import { setsQuery } from "@/modules/data/shared/setsQueryOptions";

type SetsPageProps = {
  searchParams?: Promise<{
    create?: string;
  }>;
};

export default async function SetsPage({ searchParams }: SetsPageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(setsQuery());

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const shouldOpenCreate = resolvedSearchParams?.create === "true";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SetsView shouldOpenCreate={shouldOpenCreate} />
    </HydrationBoundary>
  );
}
