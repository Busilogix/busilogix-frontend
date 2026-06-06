const STORAGE_KEY = "busilogix-recent-billing-products";
const MAX_RECENT_PRODUCTS = 16;

type RecentProductEntry = {
  productId: string;
  count: number;
  lastUsedAt: number;
};

export function loadRecentBillingProductIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as RecentProductEntry[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((entry) => entry.productId)
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return right.lastUsedAt - left.lastUsedAt;
      })
      .map((entry) => entry.productId)
      .slice(0, MAX_RECENT_PRODUCTS);
  } catch {
    return [];
  }
}

export function recordBillingProduct(productId: string): void {
  if (typeof window === "undefined" || !productId) {
    return;
  }

  const existing = loadRecentBillingProductEntries().filter(
    (entry) => entry.productId !== productId,
  );

  const current = loadRecentBillingProductEntries().find(
    (entry) => entry.productId === productId,
  );

  const next: RecentProductEntry[] = [
    {
      productId,
      count: (current?.count ?? 0) + 1,
      lastUsedAt: Date.now(),
    },
    ...existing,
  ].slice(0, MAX_RECENT_PRODUCTS);

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage failures.
  }
}

function loadRecentBillingProductEntries(): RecentProductEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as RecentProductEntry[];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
