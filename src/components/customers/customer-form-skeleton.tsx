import { Skeleton } from "@/components/ui/skeleton";

export function CustomerFormSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading customer">
      <div className="surface-card rounded-xl p-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-full max-w-md" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="surface-card space-y-4 rounded-xl p-5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="surface-card space-y-4 rounded-xl p-5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="surface-card flex justify-end rounded-xl p-4">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
