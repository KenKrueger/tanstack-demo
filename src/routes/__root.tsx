import * as React from "react";
import {
  Outlet,
  createRootRouteWithContext,
  useMatches,
} from "@tanstack/react-router";
import { RootLayout } from "../components/layout";
import { QueryClient } from "@tanstack/react-query";
import { Spinner } from "../main";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  wrapInSuspense: true,
});

// https://github.com/TanStack/router/discussions/1056#discussioncomment-10275259
const TITLE = "Fake Bank Inc.";
function Meta_RemoveWhenOfficiallyAdded({
  children,
}: {
  children: React.ReactNode;
}) {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta?.title);

  React.useEffect(() => {
    document.title = [meta?.title, TITLE].filter(Boolean).join(" · ");
  }, [meta]);

  return children;
}

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
          <Meta_RemoveWhenOfficiallyAdded>
            <Outlet />
          </Meta_RemoveWhenOfficiallyAdded>
        </React.Suspense>
      </RootLayout>
      <React.Suspense fallback={<Spinner />}>
        <TanStackRouterDevtools position="top-right" />
      </React.Suspense>
    </>
  );
}
