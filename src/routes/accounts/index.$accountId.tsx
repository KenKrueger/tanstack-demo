import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  accountQueryOptions,
  accountsQueryOptions,
} from "../../lib/api/fake-api";
import { Card } from "../../components/card";
import { DateFormatter } from "../../components/DateFormatter";
import { DialogTrigger } from "react-aria-components";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Dialog } from "../../components/ui/Dialog";
import { TransferForm } from "../../components/forms/transfer-form";

export const Route = createFileRoute("/accounts/index/$accountId")({
  loader: (opts) => {
    const { accountId } = opts.params;
    opts.context.queryClient.prefetchQuery(accountQueryOptions(accountId));
  },
  component: AccountDetailsPage,
  head: () => ({
    meta: [{ title: "Account Details" }],
  }),
});

function AccountDetailsPage() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const { accountId } = Route.useParams();
  const account = accounts.find((acct) => acct.id === accountId);
  const isCredit = account?.type === "CREDIT";

  if (!account) return <div>Account not found</div>;

  return (
    <div className="min-h-screen">
      <div
        className={`bg-gradient-to-r ${
          account.type === "CHECKING"
            ? "from-blue-600 to-blue-800"
            : account.type === "SAVINGS"
            ? "from-emerald-600 to-emerald-800"
            : "from-purple-600 to-indigo-800"
        } text-white p-6 pt-12 pb-20`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">{account.displayName}</h1>
          <p className="text-sm opacity-80">{account.accountNumber}</p>
          <div className="mt-6">
            <p className="text-sm opacity-80">
              {isCredit ? "Current Balance" : "Available Balance"}
            </p>
            <p className="text-4xl font-bold">
              $
              {(isCredit
                ? account.balance
                : account.availableBalance
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">
                {isCredit ? "Available Credit" : "Current Balance"}
              </p>
              <p className="text-xl font-semibold">
                $
                {(isCredit
                  ? account.availableCredit
                  : account.balance
                ).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                {isCredit ? "Credit Limit" : "Routing Number"}
              </p>
              <p className="text-xl font-semibold">
                {isCredit
                  ? `$${account.creditLimit.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}`
                  : account.routingNumber}
              </p>
            </div>

            {isCredit && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-xl font-semibold">
                    <DateFormatter date={account.dueDate} />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Minimum Payment</p>
                  <p className="text-xl font-semibold">
                    ${account.minimumPayment}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <DialogTrigger>
              <Button variant="primary" className="flex-1">
                {isCredit ? "Make a Payment" : "Transfer Money"}
              </Button>
              <Modal>
                <Dialog>
                  {({ close }) => (
                    <TransferForm
                      accountId={accountId}
                      mode={isCredit ? "payment" : "transfer"}
                      onClose={close}
                    />
                  )}
                </Dialog>
              </Modal>
            </DialogTrigger>

            <Button variant="secondary" className="flex-1">
              {isCredit ? "View Statement" : "Download Details"}
            </Button>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="divide-y">
            {account.transactions?.slice(0, 10).map((tx, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      <DateFormatter date={tx.date} />
                    </p>
                  </div>
                  <p
                    className={`font-semibold ${
                      tx.amount < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
