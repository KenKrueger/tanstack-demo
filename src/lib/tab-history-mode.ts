import { useSyncExternalStore } from "react";

export type TabHistoryMode = "native" | "web";

export const DEFAULT_TAB_HISTORY_MODE: TabHistoryMode = "native";
export const TAB_HISTORY_MODE_STORAGE_KEY = "tab-history-mode";

const listeners = new Set<() => void>();
let storageListenerInstalled = false;

function isTabHistoryMode(value: string | null): value is TabHistoryMode {
  return value === "native" || value === "web";
}

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function ensureStorageListener() {
  if (storageListenerInstalled || typeof window === "undefined") return;

  window.addEventListener("storage", (event) => {
    if (event.key === TAB_HISTORY_MODE_STORAGE_KEY) {
      notifyListeners();
    }
  });

  storageListenerInstalled = true;
}

export function getTabHistoryMode(): TabHistoryMode {
  if (typeof window === "undefined") {
    return DEFAULT_TAB_HISTORY_MODE;
  }

  try {
    const storedValue = window.localStorage.getItem(TAB_HISTORY_MODE_STORAGE_KEY);
    if (isTabHistoryMode(storedValue)) {
      return storedValue;
    }
  } catch {
    // Fall back to default when storage is unavailable.
  }

  return DEFAULT_TAB_HISTORY_MODE;
}

export function setTabHistoryMode(mode: TabHistoryMode) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(TAB_HISTORY_MODE_STORAGE_KEY, mode);
  } catch {
    // Ignore persistence errors and still update live subscribers.
  }

  notifyListeners();
}

function subscribe(listener: () => void) {
  ensureStorageListener();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useTabHistoryMode(): TabHistoryMode {
  return useSyncExternalStore(
    subscribe,
    getTabHistoryMode,
    () => DEFAULT_TAB_HISTORY_MODE
  );
}

