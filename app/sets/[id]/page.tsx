import { SetDetailView } from "@/modules/components/sets/set-detail-view";

interface SetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SetDetailPage({ params }: SetDetailPageProps) {
  const { id } = await params;

  return <SetDetailView id={parseInt(id, 10)} />;
}
