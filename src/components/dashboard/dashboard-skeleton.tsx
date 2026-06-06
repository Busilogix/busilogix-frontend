import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function WelcomeSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 sm:p-6">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-3 h-8 w-64 sm:h-9" />
      <Skeleton className="mt-2 h-4 w-72" />
    </div>
  );
}

function QuickActionsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-start gap-3 rounded-xl border bg-card p-4"
        >
          <Skeleton className="size-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MetricCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSectionSkeleton({ titleWidth }: { titleWidth: string }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <Skeleton className={`h-4 ${titleWidth}`} />
        <Skeleton className="h-6 w-16" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="h-3 w-12" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-3 w-10" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="ml-auto h-3 w-10" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-3.5 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3.5 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-3.5 w-14" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <WelcomeSkeleton />
      <QuickActionsSkeleton />
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-3 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-7 w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TableSectionSkeleton titleWidth="w-32" />
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Skeleton className="size-8 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
