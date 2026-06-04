import { Users } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/layout/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerRecord } from "@/lib/customers/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RecentCustomersTableProps = {
  customers: CustomerRecord[];
};

export function RecentCustomersTable({ customers }: RecentCustomersTableProps) {
  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b space-y-0">
        <div>
          <CardTitle>Recent customers</CardTitle>
          <CardDescription>Recently added or updated</CardDescription>
        </div>
        <Link
          href="/customers"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {customers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="No customers yet"
              description="Add customers to start creating invoices."
              action={{ label: "Add customer", href: "/customers/new" }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      href={`/customers/${customer.id}/edit`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {customer.name}
                    </Link>
                    <p className="text-xs text-muted-foreground md:hidden">
                      {customer.email}
                    </p>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {customer.email}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {customer.phone}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
