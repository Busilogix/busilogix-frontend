export type RecentBillingCustomer = {
  mobile: string;
  name: string;
  email: string;
  lastUsedAt: number;
};

const STORAGE_KEY = "busilogix-recent-billing-customers";
const MAX_RECENT_CUSTOMERS = 8;

export function loadRecentBillingCustomers(): RecentBillingCustomer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as RecentBillingCustomer[];

    return Array.isArray(parsed)
      ? parsed
          .filter(
            (customer) =>
              customer.mobile?.trim() &&
              customer.name?.trim() &&
              customer.email?.trim(),
          )
          .sort((left, right) => right.lastUsedAt - left.lastUsedAt)
          .slice(0, MAX_RECENT_CUSTOMERS)
      : [];
  } catch {
    return [];
  }
}

export function saveRecentBillingCustomer(
  customer: Pick<RecentBillingCustomer, "mobile" | "name" | "email">,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedMobile = customer.mobile.trim();
  const normalizedName = customer.name.trim();
  const normalizedEmail = customer.email.trim();

  if (!normalizedMobile || !normalizedName || !normalizedEmail) {
    return;
  }

  const existing = loadRecentBillingCustomers().filter(
    (entry) => entry.mobile !== normalizedMobile,
  );

  const next: RecentBillingCustomer[] = [
    {
      mobile: normalizedMobile,
      name: normalizedName,
      email: normalizedEmail,
      lastUsedAt: Date.now(),
    },
    ...existing,
  ].slice(0, MAX_RECENT_CUSTOMERS);

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }
}

export function buildWalkInEmail(mobile: string): string {
  const digits = mobile.replace(/\D/g, "").slice(-10) || "customer";

  return `walkin+${digits}@noemail.local`;
}
