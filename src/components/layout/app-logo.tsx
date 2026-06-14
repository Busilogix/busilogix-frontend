import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const BUSILOGIX_LOGO_SRC = "/Busilogix.png";

type LogoVariant = "sidebar" | "auth" | "panel" | "popover" | "navbar";

const variantStyles: Record<
  LogoVariant,
  { wrapper: string; image: string; sizes: string }
> = {
  sidebar: {
    wrapper:
      "relative block w-[5.75rem] overflow-hidden aspect-[10/9] leading-none",
    image: "block h-auto w-full",
    sizes: "92px",
  },
  auth: {
    wrapper:
      "relative mx-auto block w-[6.5rem] overflow-hidden aspect-[10/9] leading-none",
    image: "block h-auto w-full",
    sizes: "104px",
  },
  panel: {
    wrapper:
      "relative block w-[7rem] overflow-hidden aspect-[10/9] leading-none",
    image: "block h-auto w-full",
    sizes: "112px",
  },
  popover: {
    wrapper:
      "relative block w-[4.75rem] overflow-hidden aspect-[10/9] leading-none",
    image: "block h-auto w-full",
    sizes: "76px",
  },
  navbar: {
    wrapper:
      "relative block w-9 shrink-0 overflow-hidden aspect-[20/13] leading-none",
    image: "block h-auto w-full",
    sizes: "36px",
  },
};

type AppLogoProps = {
  className?: string;
  href?: string;
  variant?: LogoVariant;
  asLink?: boolean;
  priority?: boolean;
};

export function AppLogo({
  className,
  href = "/dashboard",
  variant = "sidebar",
  asLink = true,
  priority = true,
}: AppLogoProps) {
  const styles = variantStyles[variant];

  const image = (
    <span className={cn(styles.wrapper, className)}>
      <Image
        src={BUSILOGIX_LOGO_SRC}
        alt="Busilogix"
        width={640}
        height={640}
        sizes={styles.sizes}
        className={styles.image}
        loading="eager"
        fetchPriority="high"
      />
    </span>
  );


  if (!asLink) {
    return image;
  }

  return (
    <Link
      href={href}
      className="inline-flex rounded-lg outline-none transition-opacity hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label="Busilogix home"
    >
      {image}
    </Link>
  );
}
