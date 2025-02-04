import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rewards")({
  component: Rewards,
  head: () => ({
    meta: [
      {
        title: "Rewards",
      },
    ],
  }),
});

function Rewards() {
  return (
    <>
      <div className="p-2">
        <h2 className="p-2 text-4xl font-semibold text-zinc-800">Rewards</h2>
      </div>
    </>
  );
}
