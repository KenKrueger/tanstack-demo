import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TransferForm } from "../../components/forms/transfer-form";
import { PageHeader } from "../../components/page-header";

export const Route = createFileRoute("/move-money/transfer")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Make a Transfer" }] }),
});

function RouteComponent() {
  return (
    <>
      <PageHeader title="Make a Transfer" />
      <div className="max-w-2xl mx-auto p-4">
        <Suspense
          fallback={
            <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          }
        >
          <TransferForm accountId="chk_1234" />
        </Suspense>
      </div>
    </>
  );
}
