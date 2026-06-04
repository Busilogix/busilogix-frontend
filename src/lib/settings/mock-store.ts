import { DEFAULT_SETTINGS } from "./defaults";
import type { SettingsRecord } from "./types";

const STORAGE_KEY = "busilogix_settings";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSettings(): SettingsRecord {
  if (!isBrowser()) {
    return DEFAULT_SETTINGS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }

  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } as SettingsRecord;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SettingsRecord): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
