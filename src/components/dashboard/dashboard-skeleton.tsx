import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function QuickActionsSkeleton() {
  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2 rounded-lg border bg-card/60 p-2.5">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

function MetricCardsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-24" />
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
    <div className="space-y-4">
      <QuickActionsSkeleton />
      <MetricCardsSkeleton />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex justify-between items-center py-1">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-14" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TableSectionSkeleton titleWidth="w-32" />
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-3">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <Skeleton className="size-6 rounded-md shrink-0" />
              <div className="space-y-1 flex-1">
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
