"use client";

import { useCallback, useEffect, useState } from "react";

import { ListPageHeader } from "@/components/layout/list-page-header";
import { isApiError } from "@/lib/api/errors";
import { storeService } from "@/lib/api/store.service";
import {
  getEmptyStoreSummary,
  getStoreSummary,
  type StoreSummary,
} from "@/lib/settings/store-summary";
import { STORE_UPDATED_EVENT } from "@/lib/settings/store-events";

import { SettingsOverviewCards } from "./settings-overview-cards";

export function SettingsPageHeader() {
  const [summary, setSummary] = useState<StoreSummary>(getEmptyStoreSummary());
  const [hasStore, setHasStore] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const [store, dashboard] = await Promise.all([
        storeService.getMe(),
        storeService.getDashboard(),
      ]);
      setHasStore(true);
      setSummary(getStoreSummary(store, dashboard));
    } catch (error) {
      if (isApiError(error) && error.statusCode === 404) {
        setHasStore(false);
        setSummary(getEmptyStoreSummary());
        return;
      }

      setHasStore(false);
      setSummary(getEmptyStoreSummary());
    }
  }, []);

  useEffect(() => {
    void loadSummary();

    function handleStoreUpdated() {
      void loadSummary();
    }

    window.addEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);

    return () => {
      window.removeEventListener(STORE_UPDATED_EVENT, handleStoreUpdated);
    };
  }, [loadSummary]);

  return (
    <div className="space-y-4">
      <ListPageHeader
        title="Settings"
        description="Manage your store profile, tax details, and payment information."
      />
      <SettingsOverviewCards summary={summary} hasStore={hasStore} />
    </div>
  );
}
