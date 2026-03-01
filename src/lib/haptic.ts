function isLikelyIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export const supportsHaptic =
  typeof window !== "undefined"
    ? window.matchMedia("(pointer: coarse)").matches || isLikelyIOS()
    : false;

/**
 * Type guard to check if navigator supports vibrate API.
 */
function hasVibrate(
  nav: Navigator
): nav is Navigator & { vibrate: (pattern: number | number[]) => boolean } {
  return "vibrate" in nav && typeof nav.vibrate === "function";
}

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API when available and falls back to an iOS switch-input trick.
 */
export function haptic(pattern: number | number[] = 50) {
  try {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (hasVibrate(navigator)) {
      navigator.vibrate(pattern);
      return;
    }

    if (!supportsHaptic) return;

    // iOS fallback: synthesize a switch toggle interaction.
    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.display = "none";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);

    try {
      document.head.appendChild(label);
      label.click();
    } finally {
      document.head.removeChild(label);
    }
  } catch {
    // Ignore failures and keep interactions non-blocking.
  }
}
