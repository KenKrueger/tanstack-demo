interface SafeAreaInsets {
  bottom?: number;
  maxBottom?: number;
}

declare global {
  interface Window {
    __setSafeAreaInsets?: (insets: SafeAreaInsets) => void;
  }
}

function setPixelVar(name: string, value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return;
  const clampedValue = Math.max(0, value);
  document.documentElement.style.setProperty(name, `${clampedValue}px`);
}

export function installSafeAreaBridge() {
  if (typeof window === "undefined") return;

  window.__setSafeAreaInsets = (insets: SafeAreaInsets) => {
    setPixelVar("--safe-area-bottom", insets.bottom);
    setPixelVar("--safe-area-max-bottom", insets.maxBottom);
  };
}

