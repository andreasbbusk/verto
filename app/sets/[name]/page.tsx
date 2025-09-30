import { SetDetailView } from "@/modules/components/sets/set-detail-view";

interface SetDetailPageProps {
  params: Promise<{ name: string }>;
}

export default async function SetDetailPage({ params }: SetDetailPageProps) {
  const { name } = await params;
  
  return <SetDetailView name={decodeURIComponent(name)} />;
}