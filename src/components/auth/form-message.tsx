import { AlertCircle, CheckCircle2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type FormMessageProps = {
  type: "error" | "success";
  title: string;
  message: string;
  className?: string;
};

export function FormMessage({
  type,
  title,
  message,
  className,
}: FormMessageProps) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;

  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className={cn(
        type === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-50",
        className,
      )}
    >
      <Icon aria-hidden />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
