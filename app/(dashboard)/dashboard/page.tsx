import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { DashboardView } from "@/modules/components/dashboard/dashboard-page";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";

export default async function DashboardPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(profileQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView />
    </HydrationBoundary>
  );
}
