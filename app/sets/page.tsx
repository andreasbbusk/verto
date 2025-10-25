import { SetsView } from "@/modules/components/sets/sets-view";
import { getSets } from "@/modules/actions/sets";

export default async function SetsPage() {
  const sets = await getSets();
  return <SetsView initialSets={sets} />;
}
