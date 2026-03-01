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

function RootComponent() {
  return (
    <RootLayout>
      <React.Suspense fallback={<FancySpinner />}>
        <Meta_RemoveWhenOfficiallyAdded>
          <Outlet />
        </Meta_RemoveWhenOfficiallyAdded>
      </React.Suspense>
    </RootLayout>
  );
}

function FancySpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FAF7F2]/80 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-r-amber-400 rounded-full animate-ping"></div>
      </div>
    </div>
  );
}
