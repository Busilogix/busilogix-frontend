"use client";

import { FileText, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { ListPageHeader } from "@/components/layout/list-page-header";
import {
  getCustomerStats,
  type CustomerStats,
} from "@/lib/customers/mock-store";

type CustomerFormHeaderProps = {
  mode: "create" | "edit";
};

const defaultStats: CustomerStats = {
  total: 0,
  addedThisMonth: 0,
  updatedThisWeek: 0,
};

export function CustomerFormHeader({ mode }: CustomerFormHeaderProps) {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    setStats(getCustomerStats());
  }, []);

  const isCreate = mode === "create";

  return (
    <ListPageHeader
      title={isCreate ? "Add customer" : "Edit customer"}
      description={
        isCreate
          ? "Capture contact and billing details so you can create invoices faster with accurate customer information."
          : "Update contact and billing details used across invoices and customer records."
      }
      metrics={[
        {
          title: "Customers saved",
          value: stats.total.toLocaleString(),
          description: "Currently in your workspace",
          icon: Users,
          tone: "blue",
        },
        {
          title: "Added this month",
          value: stats.addedThisMonth.toLocaleString(),
          description: "New records this month",
          icon: UserPlus,
          tone: "emerald",
        },
        {
          title: "Required field",
          value: "Mobile",
          description: "Name, email, and address are optional",
          icon: FileText,
          tone: "violet",
        },
      ]}
    />
  );
}
