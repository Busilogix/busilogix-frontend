import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  title?: string;
  description?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
};

export function LoadingState({
  title = "Loading",
  description = "Please wait while we fetch your data.",
  variant = "spinner",
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div
        className={cn("flex flex-col gap-4", className)}
        role="status"
        aria-busy="true"
        aria-label={title}
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <span className="sr-only">{title}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-center",
        className,
      )}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader2 className="size-8 animate-spin text-primary" aria-hidden />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}
