import { PageLoader } from "@/modules/components/ui/page-loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <PageLoader />
    </div>
  );
}
