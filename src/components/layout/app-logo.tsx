import Link from "next/link";
import { Receipt } from "lucide-react";

import { cn } from "@/lib/utils";

type AppLogoProps = {
  className?: string;
  showTagline?: boolean;
  href?: string;
};

export function AppLogo({
  className,
  showTagline = false,
  href = "/dashboard",
}: AppLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-xl outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <Receipt className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate font-semibold tracking-tight text-foreground">
          Busilogix
        </span>
        {showTagline ? (
          <span className="truncate text-xs text-muted-foreground">
            Business management
          </span>
        ) : null}
      </span>
    </Link>
  );
}
