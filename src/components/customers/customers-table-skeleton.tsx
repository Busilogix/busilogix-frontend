import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ROW_COUNT = 6;

export function CustomersTableSkeleton() {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="border-b px-4 py-3 sm:px-5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden xl:table-cell">Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ROW_COUNT }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="size-9 rounded-full" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-44" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                <Skeleton className="h-3.5 w-48" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-8 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
