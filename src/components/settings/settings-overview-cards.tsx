"use client";

import { Building2, CreditCard, MapPin, Receipt } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StoreSummary } from "@/lib/settings/store-summary";

type SettingsOverviewCardsProps = {
  summary: StoreSummary;
  hasStore: boolean;
};

const RING_RADIUS = 15.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type SnapshotRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
};

function SnapshotRow({
  icon,
  label,
  value,
  mono,
  className,
}: SnapshotRowProps) {
  return (
    <div className={cn("flex min-w-0 items-start gap-3", className)}>
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p
          className={cn(
            "mt-0.5 text-sm leading-snug text-foreground",
            mono && "font-mono",
            !mono && "line-clamp-2",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function SettingsOverviewCards({
  summary,
  hasStore,
}: SettingsOverviewCardsProps) {
  if (!hasStore) {
    return (
      <Card className="surface-card overflow-hidden rounded-xl">
        <CardContent className="flex items-start gap-4 p-5 sm:p-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <Building2 className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="font-semibold text-foreground">
              No store profile yet
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Add your company details, address, GST, and payment information in
              the form below. These details appear on every invoice you create.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="surface-card overflow-hidden rounded-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {summary.companyName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {summary.contactLine}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-muted/30 px-4 py-2.5">
            <div className="relative size-10">
              <svg
                className="size-10 -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r={RING_RADIUS}
                  fill="none"
                  className={cn(
                    "stroke-current transition-all duration-500",
                    summary.profileComplete === 100
                      ? "text-emerald-500"
                      : "text-primary",
                  )}
                  strokeWidth="3"
                  strokeDasharray={`${(summary.profileComplete / 100) * RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums leading-none text-foreground">
                {summary.profileComplete}%
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">complete</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 border-t pt-5 sm:grid-cols-2">
          <SnapshotRow
            icon={<MapPin className="size-3.5" aria-hidden />}
            label="Location"
            value={summary.location}
          />
          <SnapshotRow
            icon={<Receipt className="size-3.5" aria-hidden />}
            label="GST number"
            value={summary.gstNumber || "Not added"}
            mono
          />
          <SnapshotRow
            icon={<Building2 className="size-3.5" aria-hidden />}
            label="Branding"
            value={summary.hasLogo ? "Logo added" : "No logo URL"}
          />
          <SnapshotRow
            icon={<CreditCard className="size-3.5" aria-hidden />}
            label="Payments"
            value={
              summary.paymentConfigured
                ? summary.paymentPreview
                : "Not configured"
            }
          />
        </div>

        {summary.pendingActions && summary.pendingActions.length > 0 && (
          <div className="mt-5 border-t pt-5">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pending setup actions</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {summary.pendingActions.map((action) => (
                <div key={action.code} className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/40 p-3 hover:border-amber-250 transition-colors">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                    !
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
