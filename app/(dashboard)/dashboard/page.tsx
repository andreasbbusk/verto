import { DashboardView } from "@/modules/components/dashboard/dashboard-page";
import { getMe } from "@/modules/actions/user";

export default async function DashboardPage() {
  const user = await getMe();
  return <DashboardView initialUser={user} />;
}
