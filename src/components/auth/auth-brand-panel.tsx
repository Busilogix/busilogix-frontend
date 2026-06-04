import { FileText, ShieldCheck, Users } from "lucide-react";

const highlights = [
  {
    icon: FileText,
    title: "Smart invoicing",
    description: "Create, send, and track invoices in one place.",
  },
  {
    icon: Users,
    title: "Customer management",
    description: "Keep contacts and billing history organized.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & reliable",
    description: "Built for teams that need clarity and control.",
  },
];

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(1_0_0/0.18),transparent_34rem),linear-gradient(135deg,oklch(1_0_0/0.12),transparent_45%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-8rem] bottom-[-8rem] size-80 rounded-full bg-primary-foreground/10 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <p className="w-fit rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground/85">
          Busilogix
        </p>
        <h2 className="mt-5 max-w-sm text-4xl font-semibold tracking-tight">
          Run your business with confidence
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80">
          Professional invoicing and business management for modern teams.
        </p>
      </div>
      <ul className="relative space-y-6">
        {highlights.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
              <item.icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="mt-0.5 text-sm text-primary-foreground/75">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
