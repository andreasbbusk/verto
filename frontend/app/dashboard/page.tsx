import { ProtectedRoute } from "@/modules/components/layout/protected-route";
import { DashboardView } from "@/modules/components/dashboard/dashboard-view";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardView />
    </ProtectedRoute>
  );
}
