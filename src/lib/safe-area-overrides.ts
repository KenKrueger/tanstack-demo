import { useSyncExternalStore } from "react";

interface SafeAreaOverrides {
  topAdjust: number;
  bottomAdjust: number;
}

const STORAGE_KEY = "safe-area-overrides-v1";
const DEFAULT_OVERRIDES: SafeAreaOverrides = {
  topAdjust: 0,
  bottomAdjust: 0,
};

const listeners = new Set<() => void>();
let storageListenerInstalled = false;
let currentOverrides: SafeAreaOverrides = DEFAULT_OVERRIDES;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function applyToDocument(overrides: SafeAreaOverrides) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--safe-area-top-adjust", `${overrides.topAdjust}px`);
  root.style.setProperty(
    "--safe-area-bottom-adjust",
    `${overrides.bottomAdjust}px`
  );
}

function parse(raw: string | null): SafeAreaOverrides {
  if (!raw) return DEFAULT_OVERRIDES;

  try {
    const value = JSON.parse(raw) as Partial<SafeAreaOverrides>;
    return {
      topAdjust: clamp(Number(value.topAdjust ?? 0), -40, 80),
      bottomAdjust: clamp(Number(value.bottomAdjust ?? 0), -40, 80),
    };
  } catch {
    return DEFAULT_OVERRIDES;
  }
}

function getStored(): SafeAreaOverrides {
  if (typeof window === "undefined") return DEFAULT_OVERRIDES;
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_OVERRIDES;
  }
}

function areEqual(a: SafeAreaOverrides, b: SafeAreaOverrides) {
  return a.topAdjust === b.topAdjust && a.bottomAdjust === b.bottomAdjust;
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function ensureStorageListener() {
  if (storageListenerInstalled || typeof window === "undefined") return;
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      const next = getStored();
      if (areEqual(currentOverrides, next)) return;
      currentOverrides = next;
      applyToDocument(currentOverrides);
      notify();
    }
  });
  storageListenerInstalled = true;
}

export function initializeSafeAreaOverrides() {
  if (typeof window === "undefined") return;
  currentOverrides = getStored();
  applyToDocument(currentOverrides);
}

export function getSafeAreaOverrides() {
  return currentOverrides;
}

export function setSafeAreaOverrides(next: SafeAreaOverrides) {
  if (typeof window === "undefined") return;

  const sanitized: SafeAreaOverrides = {
    topAdjust: clamp(next.topAdjust, -40, 80),
    bottomAdjust: clamp(next.bottomAdjust, -40, 80),
  };

  if (areEqual(currentOverrides, sanitized)) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch {
    // Ignore storage failures; still apply to current session.
  }

  currentOverrides = sanitized;
  applyToDocument(currentOverrides);
  notify();
}

export function resetSafeAreaOverrides() {
  setSafeAreaOverrides(DEFAULT_OVERRIDES);
}

function subscribe(listener: () => void) {
  ensureStorageListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSafeAreaOverrides() {
  return useSyncExternalStore(
    subscribe,
    getSafeAreaOverrides,
    () => DEFAULT_OVERRIDES
  );
}
