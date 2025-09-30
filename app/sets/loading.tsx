import { SkeletonList } from "@/modules/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <SkeletonList />
    </div>
  )
}