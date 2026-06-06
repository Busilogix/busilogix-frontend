import { Skeleton } from "@/components/ui/skeleton";

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading settings">
      <div className="space-y-3">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="surface-card space-y-4 rounded-xl p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div
                className={
                  index === 0
                    ? "grid gap-4 sm:grid-cols-2"
                    : "grid gap-4 sm:grid-cols-3"
                }
              >
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                {index === 0 ? <Skeleton className="h-10 w-full" /> : null}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="surface-card space-y-4 rounded-xl p-5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-72" />
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
