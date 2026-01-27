import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { SetsView } from "@/modules/components/sets/sets-page";
import { setsQuery } from "@/modules/data/shared/setsQueryOptions";

export default async function SetsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(setsQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SetsView />
    </HydrationBoundary>
  );
}
