import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { SettingsView } from "@/modules/components/settings/settings-page";
import { profileQuery } from "@/modules/data/shared/profileQueryOptions";

export default async function SettingsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(profileQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsView />
    </HydrationBoundary>
  );
}
