export const STORE_UPDATED_EVENT = "busilogix:store-updated";

export function dispatchStoreUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT));
}
