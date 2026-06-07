import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InventorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="surface-card rounded-xl border border-muted-foreground/10 bg-card p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="size-8 rounded-lg" />
            </div>
            <div className="mt-2 space-y-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column: Inventory Logs Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="surface-card rounded-2xl border border-primary/5 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 px-5 py-4 bg-muted/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-3 w-80" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/10">
                    <TableRow>
                      <TableHead className="py-3 px-5"><Skeleton className="h-3 w-16" /></TableHead>
                      <TableHead className="py-3 px-3"><Skeleton className="h-3 w-24" /></TableHead>
                      <TableHead className="py-3 px-3 text-center flex justify-center"><Skeleton className="h-3 w-12" /></TableHead>
                      <TableHead className="py-3 px-3 text-center"><Skeleton className="h-3 w-16" /></TableHead>
                      <TableHead className="py-3 px-4"><Skeleton className="h-3 w-28" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <TableRow key={index} className="border-b border-border/40 last:border-b-0">
                        <TableCell className="py-3 px-5 space-y-1.5">
                          <Skeleton className="h-3.5 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </TableCell>
                        <TableCell className="py-3 px-3 space-y-1.5">
                          <Skeleton className="h-3.5 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </TableCell>
                        <TableCell className="py-3 px-3">
                          <div className="flex justify-center">
                            <Skeleton className="h-5 w-14 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-3">
                          <div className="flex justify-center">
                            <Skeleton className="h-4 w-8" />
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <Skeleton className="h-3.5 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeletons */}
        <div className="space-y-6">
          {/* Most Active Items Skeleton */}
          <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 px-4 py-3 bg-muted/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-2 w-20" />
                    </div>
                    <Skeleton className="h-4.5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Current Stock Levels Skeleton */}
          <Card className="surface-card rounded-2xl border border-primary/5 shadow-sm bg-card">
            <CardHeader className="border-b border-border/40 px-4 py-3 bg-muted/5 space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-3.5 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
