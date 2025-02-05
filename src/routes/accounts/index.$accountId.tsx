import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card } from "../../components/card";
import { DateFormatter } from "../../components/DateFormatter";
import {
  accountQueryOptions,
  accountsQueryOptions,
} from "../../lib/api/fake-api";

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: (opts) => {
    const { accountId } = opts.params;
    opts.context.queryClient.prefetchQuery(accountQueryOptions(accountId));
  },
  component: HomeLoadingWrapper,
  head: () => ({ meta: [{ title: "Account Details" }] }),
});

function HomeLoadingWrapper() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const account = accounts.find(
    (acct) => acct.id === Route.useParams().accountId
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-semibold text-zinc-800">
        {account?.displayName}
      </h1>
      <Card className="p-4">
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
  const { accountId } = Route.useParams();
  const { data } = useSuspenseQuery(accountQueryOptions(accountId));
  if (!data) return null;

  const { transactions } = data;
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3">Transaction History:</h3>
      <div className="overflow-x-auto">
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
                  <DateFormatter date={t.date} />
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

function TableSkeleton() {
  return (
    <Card className="overflow-hidden p-4 animate-pulse">
      <div className="h-8 bg-gray-200 w-32 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded flex-1" />
            <div className="h-5 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}
