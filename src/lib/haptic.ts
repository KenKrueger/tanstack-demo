export const supportsHaptic =
  typeof window !== "undefined"
    ? window.matchMedia("(pointer: coarse)").matches
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
    if (!supportsHaptic || typeof document === "undefined") return;

    if (hasVibrate(navigator)) {
      navigator.vibrate(pattern);
      return;
    }

    // iOS fallback: synthesize a switch toggle interaction.
    const label = document.createElement("label");
    label.setAttribute("aria-hidden", "true");
    label.style.position = "fixed";
    label.style.left = "-9999px";
    label.style.top = "0";
    label.style.opacity = "0";
    label.style.pointerEvents = "none";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.appendChild(input);

    try {
      document.body.appendChild(label);
      input.click();
    } finally {
      label.remove();
    }
  } catch {
    // Ignore failures and keep interactions non-blocking.
  }
}

