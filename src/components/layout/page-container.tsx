import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageContainer({
  children,
  title,
  description,
  actions,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6",
        className,
      )}
    >
      {(title || description || actions) && (
        <div className="relative flex flex-col gap-2 pb-4 mb-5 border-b border-border/60 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            {title ? (
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}
