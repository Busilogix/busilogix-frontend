"use client";

import { Eye, Mail, MapPin, Pencil, Phone } from "lucide-react";
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
import { getCustomerDisplayName } from "@/lib/customers/map-api-customer";
import type { CustomerRecord } from "@/lib/customers/types";

type CustomersTableProps = {
  customers: CustomerRecord[];
  totalItems: number;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CustomerAvatar({ name }: { name: string }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/15">
      {getInitials(name) || "?"}
    </span>
  );
}

export function CustomersTable({ customers, totalItems }: CustomersTableProps) {
  return (
    <div className="surface-card overflow-hidden rounded-xl">
      <div className="flex flex-col gap-1 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Customer directory
          </p>
          <p className="text-xs text-muted-foreground">
            {totalItems} record{totalItems === 1 ? "" : "s"} in your workspace
          </p>
        </div>
      </div>

      <div className="overflow-x-auto w-full min-w-0">
        <Table className="min-w-[750px]">
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => {
              const displayName = getCustomerDisplayName(customer);

              return (
                <TableRow key={customer.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={displayName} />
                      <div className="min-w-0">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary hover:underline"
                        >
                          {displayName}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="size-3.5 shrink-0" aria-hidden />
                        <span className="truncate">{customer.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="size-3.5 shrink-0" aria-hidden />
                        <span>{customer.phone || "—"}</span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="flex max-w-xs items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-2">{customer.address}</span>
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="sm:hidden"
                        aria-label={`View ${displayName}`}
                        render={<Link href={`/customers/${customer.id}`} />}
                      >
                        <Eye className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:inline-flex"
                        render={<Link href={`/customers/${customer.id}/edit`} />}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="sm:hidden"
                        aria-label={`Edit ${displayName}`}
                        render={<Link href={`/customers/${customer.id}/edit`} />}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
