import { createFileRoute } from "@tanstack/react-router";
import {
  accountQueryOptions,
  accountsQueryOptions,
} from "../../lib/api/fake-api";
import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: (opts) => {
    const accountId = opts.params.accountId;
    opts.context.queryClient.prefetchQuery(accountQueryOptions(accountId));
  },
  component: HomeLoadingWrapper,
  pendingComponent: () => <div>Loading...</div>,
});

function HomeLoadingWrapper() {
  const accountData = useSuspenseQuery(accountsQueryOptions);
  const { data: accounts } = accountData;
  const account = accounts.find(
    (account) => account.id === Route.useParams().accountId
  );

  return (
    <div className="p-2">
      <h1 className="p-2 text-4xl font-semibold text-gray-600">
        {account?.displayName}
      </h1>
      <Suspense fallback={<div className="p-4">Loading account...</div>}>
        <RouteComponent />
      </Suspense>
    </div>
  );
}

function RouteComponent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(accountQueryOptions(params.accountId));

  if (!data) {
    return null;
  }

  const { transactions } = data;

  return (
    <div>
      <h2 className="mt-4 text-lg font-medium">Transaction History:</h2>
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
    </div>
  );
}
