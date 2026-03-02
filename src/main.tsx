import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { CriticalErrorFallback } from "./critical-error-fallback";
import { installSafeAreaBridge } from "./lib/safe-area-bridge";
import { initializeSafeAreaOverrides } from "./lib/safe-area-overrides";
import { consumeProgrammaticPopTransitionOverride } from "./lib/view-transition-overrides";
import { getMainNavPathname } from "./lib/main-nav-themes";

type LocationWithHistoryIndex = {
  pathname: string;
  href: string;
  hash: string;
  state?: unknown;
};

type ViewTransitionLocationChange = {
  fromLocation?: LocationWithHistoryIndex;
  toLocation: LocationWithHistoryIndex;
  pathChanged: boolean;
  hrefChanged: boolean;
  hashChanged: boolean;
};

const MOBILE_POINTER_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";
const MOBILE_VIEWPORT_MEDIA_QUERY = "(max-width: 1024px)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    (window.matchMedia(MOBILE_POINTER_MEDIA_QUERY).matches ||
      window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches)
  );
}

function isIOSSafari() {
  if (typeof navigator === "undefined" || typeof document === "undefined") {
    return false;
  }

  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Mac") && "ontouchend" in document);
  const isWebKit =
    ua.includes("AppleWebKit") && !ua.includes("CriOS") && !ua.includes("FxiOS");

  return isIOS && isWebKit;
}

function getHistoryIndex(location?: LocationWithHistoryIndex): number | null {
  if (!location || typeof location.state !== "object" || location.state === null) {
    return null;
  }

  const maybeIndex = (location.state as { __TSR_index?: unknown }).__TSR_index;
  return typeof maybeIndex === "number" ? maybeIndex : null;
}

function resolveViewTransitionTypes({
  fromLocation,
  toLocation,
  pathChanged,
}: ViewTransitionLocationChange): string[] | false {
  if (!isMobileViewport()) return false;
  if (prefersReducedMotion()) return false;

  const doc = document as Document & { activeViewTransition?: unknown };
  if (doc.activeViewTransition) return false;
  if (document.getElementById("splashcontainer")) return false;

  if (!pathChanged) return false;
  if (!fromLocation) return false;

  const fromMainNavPathname = getMainNavPathname(fromLocation.pathname);
  const toMainNavPathname = getMainNavPathname(toLocation.pathname);

  // Bottom-tab switches should feel instant with no page transition.
  if (
    fromMainNavPathname &&
    toMainNavPathname &&
    fromMainNavPathname !== toMainNavPathname
  ) {
    return false;
  }

  const fromIndex = getHistoryIndex(fromLocation);
  const toIndex = getHistoryIndex(toLocation);

  if (fromIndex !== null && toIndex !== null) {
    if (toIndex > fromIndex) return ["push"];
    if (toIndex < fromIndex) {
      // Keep iOS swipe-back gesture as the only back animation.
      if (isIOSSafari()) {
        if (consumeProgrammaticPopTransitionOverride()) return ["pop"];
        return false;
      }
      return ["pop"];
    }
  }

  return ["push"];
}

export const queryClient = new QueryClient();
installSafeAreaBridge();
initializeSafeAreaOverrides();

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: Spinner,
  defaultViewTransition: {
    types: resolveViewTransitionTypes,
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
const splash = document.getElementById("splashcontainer");

// Minimum splash display time to avoid a flash
const SPLASH_MIN_MS = 800;
const splashStart = performance.now();

function removeSplash() {
  if (!splash) return;
  const elapsed = performance.now() - splashStart;
  const remaining = Math.max(0, SPLASH_MIN_MS - elapsed);
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 400);
  }, remaining);
}

// Remove splash once the router has loaded its first route
router.subscribe("onResolved", () => {
  removeSplash();
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <ErrorBoundary FallbackComponent={CriticalErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

/** Spinner to show while route is pending */
export function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
    </div>
  );
}
