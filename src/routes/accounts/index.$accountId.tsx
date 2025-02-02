import { createFileRoute } from "@tanstack/react-router";
import {
  accountQueryOptions,
  accountsQueryOptions,
} from "../../lib/api/fake-api";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "../../components/card";

/** Skeleton to show while we are fetching table data */
function TableSkeleton() {
  return (
    <div className="p-4">
      {/* "Transactions" heading skeleton */}
      <div className="h-6 bg-gray-200 w-1/4 rounded mb-4"></div>
      {/* Skeleton rows */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex space-x-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: (opts) => {
    const accountId = opts.params.accountId;
    opts.context.queryClient.prefetchQuery(accountQueryOptions(accountId));
  },
  // Shows the spinner while the route is pending (e.g. prefetching queries)
  component: HomeLoadingWrapper,
});

function HomeLoadingWrapper() {
  // Suspense for the account list. If this is still loading, we see the route’s spinner.
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const account = accounts.find(
    (acct) => acct.id === Route.useParams().accountId
  );

  return (
    <div className="flex  flex-col gap-4 p-2">
      <h1 className="p-2 text-4xl font-semibold text-gray-600">
        {account?.displayName}
      </h1>
      <Card>
        <div className="text-xl">
          Available Balance: ${account?.availableBalance}
        </div>
        <div className="text-xl">Current Balance: ${account?.balance}</div>
      </Card>
      <Suspense fallback={<TableSkeleton />}>
        <RouteComponent />
      </Suspense>
    </div>
  );
}

function RouteComponent() {
  // Fetch the transactions for the single account
  const params = Route.useParams();
  const { data } = useSuspenseQuery(accountQueryOptions(params.accountId));

  if (!data) return null;

  const { transactions } = data;

  return (
    <Card>
      <h3 className="text-lg font-medium">Transaction History:</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b border-gray-200 text-left">
                Date
              </th>
              <th className="px-4 py-2 border-b border-gray-200 text-left">
                Description
              </th>
              <th className="px-4 py-2 border-b border-gray-200 text-left">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b border-gray-200">
                  {new Date(t.date).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b border-gray-200">
                  {t.description}
                </td>
                <td
                  className={`px-4 py-2 border-b border-gray-200 ${
                    t.amount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {t.amount < 0 ? `-$${Math.abs(t.amount)}` : `$${t.amount}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
