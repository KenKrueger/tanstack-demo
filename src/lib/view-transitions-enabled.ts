import { useSyncExternalStore } from "react";

export const DEFAULT_VIEW_TRANSITIONS_ENABLED = false;
export const VIEW_TRANSITIONS_ENABLED_STORAGE_KEY = "view-transitions-enabled";

const listeners = new Set<() => void>();
let storageListenerInstalled = false;

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function ensureStorageListener() {
  if (storageListenerInstalled || typeof window === "undefined") return;

  window.addEventListener("storage", (event) => {
    if (event.key === VIEW_TRANSITIONS_ENABLED_STORAGE_KEY) {
      notifyListeners();
    }
  });

  storageListenerInstalled = true;
}

export function getViewTransitionsEnabled(): boolean {
  if (typeof window === "undefined") {
    return DEFAULT_VIEW_TRANSITIONS_ENABLED;
  }

  try {
    return window.localStorage.getItem(VIEW_TRANSITIONS_ENABLED_STORAGE_KEY) === "true";
  } catch {
    return DEFAULT_VIEW_TRANSITIONS_ENABLED;
  }
}

export function setViewTransitionsEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(VIEW_TRANSITIONS_ENABLED_STORAGE_KEY, String(enabled));
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

export function useViewTransitionsEnabled() {
  return useSyncExternalStore(
    subscribe,
    getViewTransitionsEnabled,
    () => DEFAULT_VIEW_TRANSITIONS_ENABLED
  );
}
