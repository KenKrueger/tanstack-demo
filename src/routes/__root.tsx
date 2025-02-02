import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { RootLayout } from "../components/layout";
import { QueryClient } from "@tanstack/react-query";
import { Spinner } from "../main";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  wrapInSuspense: true,
});

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null // Render nothing in production
  : React.lazy(() =>
      // Lazy load in development
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      }))
    );

function RootComponent() {
  return (
    <>
      <RootLayout>
        <React.Suspense fallback={<Spinner />}>
          <Outlet />
        </React.Suspense>
      </RootLayout>
      <React.Suspense fallback={<Spinner />}>
        <TanStackRouterDevtools position="top-right" />
      </React.Suspense>
    </>
  );
}
