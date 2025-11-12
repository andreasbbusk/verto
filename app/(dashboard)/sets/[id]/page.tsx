import { SetDetailView } from "@/modules/components/sets/set-detail";
import { getSetById } from "@/modules/actions/sets";

interface SetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SetDetailPage({ params }: SetDetailPageProps) {
  const { id } = await params;
  const set = await getSetById(id);

  return <SetDetailView initialSet={set} />;
}
