import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { DashboardView } from "@/modules/components/dashboard/dashboard-view";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";
import { setsQuery } from "@/modules/data/shared/setsQueryOptions";

export default async function DashboardPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(profileQuery());
  await queryClient.prefetchQuery(setsQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />
    </HydrationBoundary>
  );
}
