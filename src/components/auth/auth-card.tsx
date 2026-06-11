import Link from "next/link";

import { AppLogo } from "@/components/layout/app-logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-[480px]", className)}>
      <div className="mb-5 flex justify-center lg:hidden">
        <AppLogo variant="auth" href="/login" />
      </div>

      <Card className="shadow-lg shadow-slate-950/8 ring-1 ring-black/5">
        <CardHeader className="space-y-1 border-b pb-5">
          <CardTitle className="text-[22px] font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-2">{children}</CardContent>
        {footer ? (
          <CardFooter className="justify-center border-t bg-muted/30 py-4 text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}

type AuthCardLinkProps = {
  text: string;
  linkText: string;
  href: string;
};

export function AuthCardLink({ text, linkText, href }: AuthCardLinkProps) {
  return (
    <p>
      {text}{" "}
      <Link
        href={href}
        className="font-semibold text-primary underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}
