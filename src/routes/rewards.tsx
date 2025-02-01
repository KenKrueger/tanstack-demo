import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rewards")({
  component: Rewards,
});

function Rewards() {
  return (
    <div className="p-2">
      <h3>Rewards</h3>
    </div>
  );
}
