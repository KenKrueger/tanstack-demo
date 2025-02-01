import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { RootLayout } from "../components/layout";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to="/about"
          activeProps={{
            className: "font-bold",
          }}
        >
          About
        </Link>
        <Link
          to="/move-money"
          activeProps={{
            className: "font-bold",
          }}
        >
          Move Money
        </Link>
        <Link
          to="/profile"
          activeProps={{
            className: "font-bold",
          }}
        >
          Profile
        </Link>
      </div>
      <hr /> */}
      <RootLayout>
        <Outlet />
      </RootLayout>
      <TanStackRouterDevtools position="top-right" />
    </>
  );
}
