"use client";

import { useSyncExternalStore } from "react";

import {
  hasAccessToken,
  subscribeToAuthChanges,
} from "@/lib/api/token-storage";

export function useHasAccessToken(): boolean {
  return useSyncExternalStore(
    subscribeToAuthChanges,
    () => hasAccessToken(),
    () => false,
  );
}
