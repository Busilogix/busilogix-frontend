import type { InvoiceTaxType } from "@/lib/api/types/invoice.types";

const STORAGE_KEY = "busilogix-invoice-tax-preferences";

export type InvoiceTaxPreferences = {
  taxPercentage: number;
  taxType: InvoiceTaxType;
};

export const GST_PRESETS = [0, 5, 12, 18, 28] as const;

export function loadInvoiceTaxPreferences(): Partial<InvoiceTaxPreferences> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Partial<InvoiceTaxPreferences>;

    return {
      ...(typeof parsed.taxPercentage === "number"
        ? { taxPercentage: parsed.taxPercentage }
        : {}),
    };
  } catch {
    return {};
  }
}

export function saveInvoiceTaxPreferences(prefs: InvoiceTaxPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore storage failures.
  }
}
