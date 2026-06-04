"use client";

import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CustomerRecord } from "@/lib/customers/types";

type CustomersTableProps = {
  customers: CustomerRecord[];
  onDeleteCustomer?: (customer: CustomerRecord) => void;
};

export function CustomersTable({
  customers,
  onDeleteCustomer,
}: CustomersTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-2xl">
      <div className="border-b px-5 py-4">
        <p className="font-medium">Customer records</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit a customer any time to keep invoice details accurate.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/customers/${customer.id}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {customer.name}
                  </Link>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    View profile
                  </Link>
                  <span className="text-xs text-muted-foreground md:hidden">
                    {customer.email}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {customer.email}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {customer.phone}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/customers/${customer.id}/edit`} />}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit
                  </Button>
                  {onDeleteCustomer ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDeleteCustomer(customer)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Delete
                    </Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
