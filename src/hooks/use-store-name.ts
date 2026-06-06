"use client";

import { useCallback, useEffect, useState } from "react";

import { isApiError } from "@/lib/api/errors";
import { storeService } from "@/lib/api/store.service";
import { STORE_UPDATED_EVENT } from "@/lib/settings/store-events";

export function useStoreName() {
  const [storeName, setStoreName] = useState("");

  const loadStoreName = useCallback(async () => {
    try {
      const store = await storeService.getMe();
      setStoreName(store.name.trim());
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404) {
        setStoreName("");
        return;
      }

      setStoreName("");
    }
  }, []);

  useEffect(() => {
    void loadStoreName();

    function handleStoreUpdated() {
      void loadStoreName();
    }

    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);

    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);
    };
  }, [loadStoreName]);

  return storeName;
}
