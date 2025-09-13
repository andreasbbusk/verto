import { ProtectedRoute } from "@/modules/components/layout/protected-route";
import { SetsView } from "@/modules/components/sets/sets-view";

export default function SetsPage() {
  return (
    <ProtectedRoute>
      <SetsView />
    </ProtectedRoute>
  );
}
