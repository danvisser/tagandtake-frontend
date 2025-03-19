import LoadingSpinner from "@src/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
