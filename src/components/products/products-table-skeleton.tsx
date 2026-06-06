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

export function ProductsTableSkeleton() {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="border-b px-4 py-3 sm:px-5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-28" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="hidden sm:table-cell text-center">
              Status
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: ROW_COUNT }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-14" />
              </TableCell>
              <TableCell>
                <Skeleton className="mx-auto h-4 w-10" />
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <Skeleton className="mx-auto h-5 w-14 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-8 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
