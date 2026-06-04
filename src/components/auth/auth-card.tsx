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
    <div className={cn("w-full max-w-md", className)}>
      <div className="mb-8 flex justify-center lg:hidden">
        <AppLogo href="/login" showTagline />
      </div>
      <Card className="shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">{children}</CardContent>
        {footer ? (
          <CardFooter className="justify-center border-t bg-transparent py-4 text-sm text-muted-foreground">
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
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
}
