import { ArrowRight, FileText, Settings, Users } from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const steps = [
  {
    title: "Add customers",
    description: "Save customer contact and billing details first.",
    href: "/customers/new",
    icon: Users,
  },
  {
    title: "Create invoices",
    description: "Build invoices with automatic totals and taxes.",
    href: "/invoices/new",
    icon: FileText,
  },
  {
    title: "Review settings",
    description: "Set your company, tax, and invoice preferences.",
    href: "/settings",
    icon: Settings,
  },
];

export function GettingStartedCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Start here</CardTitle>
        <CardDescription>
          New to Busilogix? These steps cover the usual setup flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
        {steps.map((step) => (
          <Link
            key={step.title}
            href={step.href}
            className="group rounded-2xl border bg-background/70 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md hover:shadow-slate-950/10"
          >
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{step.title}</p>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
