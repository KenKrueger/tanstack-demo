import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TransferForm } from "../../components/forms/transfer-form";

export const Route = createFileRoute("/move-money/transfer")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Make a Transfer" }] }),
});

function RouteComponent() {
  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <Suspense
        fallback={
          <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
        }
      >
        <TransferForm accountId="chk_1234" />
      </Suspense>
    </div>
  );
}
