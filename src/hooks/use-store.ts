"use client";

import { useCallback, useEffect, useState } from "react";

import { storeService } from "@/lib/api/store.service";
import type { ApiStore } from "@/lib/api/types/store.types";
import { STORE_UPDATED_EVENT } from "@/lib/settings/store-events";

export function useStore() {
  const [store, setStore] = useState<ApiStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStore = useCallback(async () => {
    try {
      const data = await storeService.getMe();
      setStore(data);
    } catch {
      setStore(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStore();

    function handleStoreUpdated() {
      void loadStore();
    }

    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);

    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);
    };
  }, [loadStore]);

  return { store, isLoading };
}
