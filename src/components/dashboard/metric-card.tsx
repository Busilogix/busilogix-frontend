import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  tone?: "blue" | "emerald" | "amber" | "violet";
  className?: string;
};

const toneClasses = {
  blue: "bg-blue-500/10 text-blue-600 ring-blue-500/15",
  emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15",
  amber: "bg-amber-500/10 text-amber-600 ring-amber-500/15",
  violet: "bg-violet-500/10 text-violet-600 ring-violet-500/15",
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  tone = "blue",
  className,
}: MetricCardProps) {
  return (
    <Card
      size="sm"
      className={cn("interactive-card overflow-hidden", className)}
    >
      <CardContent className="relative flex items-start justify-between gap-3 p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary/30 to-transparent" />
        <div className="min-w-0 space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="truncate text-2xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {description ? (
            <p className="text-xs leading-normal text-muted-foreground/80">
              {description}
            </p>
          ) : null}
          {trend ? (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {trend}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg ring-1",
            toneClasses[tone],
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </CardContent>
    </Card>
  );
}
