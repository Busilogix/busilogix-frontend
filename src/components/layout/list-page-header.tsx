"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ListPageMetric = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone?: "blue" | "emerald" | "amber" | "violet";
};

type ListPageHeaderProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  actions?: React.ReactNode;
  metrics?: ListPageMetric[];
  className?: string;
};

export function ListPageHeader({
  title,
  description,
  action,
  actions,
  metrics = [],
  className,
}: ListPageHeaderProps) {
  const ActionIcon = action?.icon;

  return (
    <div className={cn("space-y-4", className)}>
      <section className="rounded-2xl border border-primary/10 bg-[linear-gradient(135deg,oklch(0.97_0.02_252)_0%,oklch(1_0_0)_55%,oklch(0.99_0.01_250)_100%)] p-5 shadow-sm shadow-primary/5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : action ? (
            <Button
              render={<Link href={action.href} />}
              className="shrink-0 shadow-sm"
            >
              {ActionIcon ? (
                <ActionIcon className="size-4" aria-hidden />
              ) : null}
              {action.label}
            </Button>
          ) : null}
        </div>
      </section>

      {metrics.length > 0 ? (
        <section
          className={cn(
            "grid gap-4",
            metrics.length >= 4
              ? "sm:grid-cols-2 xl:grid-cols-4"
              : "sm:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              icon={metric.icon}
              tone={metric.tone ?? "blue"}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
