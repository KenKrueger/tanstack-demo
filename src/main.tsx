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
  defaultViewTransition: false,
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
