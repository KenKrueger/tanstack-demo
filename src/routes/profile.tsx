import { createFileRoute } from "@tanstack/react-router";
import { WrappedLink } from "../components/wrapped-link";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="p-2">
        <h1 className="p-2 text-4xl font-semibold text-zinc-800">
          Profile & Settings
        </h1>
      </div>
    </>
  );
}
