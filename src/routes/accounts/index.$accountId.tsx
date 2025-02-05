import * as React from "react";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  accountQueryOptions,
  accountsQueryOptions,
} from "../../lib/api/fake-api";
import { Card } from "../../components/card";
import { DateFormatter } from "../../components/DateFormatter";
import { WrappedLink } from "../../components/wrapped-link";

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: (opts) => {
    const { accountId } = opts.params;
    opts.context.queryClient.prefetchQuery(accountQueryOptions(accountId));
  },
  component: AccountDetailsPage,
  head: () => ({
    meta: [
      {
        title: "Account Details",
      },
    ],
  }),
});

function AccountDetailsPage() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const { accountId } = Route.useParams();
  const account = accounts.find((acct) => acct.id === accountId);

  return (
    <div className="min-h-screen bg-zinc-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-4xl font-bold text-zinc-800 mb-6">
            {account?.displayName}
          </h1>
        </header>

        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <div className="text-sm text-zinc-500 font-medium">
                Available Balance
              </div>
              <div className="text-4xl font-bold text-zinc-900">
                $
                {account?.availableBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="text-sm text-zinc-500 font-medium">
                Current Balance
              </div>
              <div className="text-2xl font-medium text-zinc-700">
                $
                {account?.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        </Card>

        <section>
          <Suspense fallback={<TableSkeleton />}>
            <TransactionHistory accountId={accountId} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function TransactionHistory({ accountId }: { accountId: string }) {
  const { data } = useSuspenseQuery(accountQueryOptions(accountId));
  if (!data) return null;
  const { transactions } = data;

  return (
    <Card>
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-zinc-900">
          Recent Transactions
        </h2>
      </div>
      <div className="divide-y">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-zinc-50"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-zinc-900 truncate">
                {tx.description}
              </div>
              <div className="text-xs text-zinc-500">
                <DateFormatter date={tx.date} />
              </div>
            </div>
            <div
              className={`text-sm font-medium tabular-nums ${
                tx.amount < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              $
              {Math.abs(tx.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card>
      <div className="px-6 py-4 border-b">
        <div className="h-6 w-32 bg-zinc-200 rounded animate-pulse" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-6 py-4 flex items-center justify-between animate-pulse"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-zinc-200 rounded" />
              <div className="h-3 w-20 bg-zinc-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
    </Card>
  );
}
