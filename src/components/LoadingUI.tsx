import { Skeleton } from "@src/components/ui/skeleton";

export default function LoadingUI() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="w-full h-12 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
      <Skeleton className="w-3/4 h-4 mt-6 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-2" />
      <Skeleton className="w-5/6 h-4 mb-2" />
    </div>
  );
}
