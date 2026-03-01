import * as React from "react";
import { Suspense } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Account,
  accountsQueryOptions,
  creditScoreQueryOptions,
} from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditScore, CreditScoreSkeleton } from "../components/credit-score";
import { Card } from "../components/card";
import { WrappedLink } from "../components/wrapped-link";
import { PageHeader } from "../components/page-header";

export const Route = createFileRoute("/")({
  loader: (opts) => {
    opts.context.queryClient.prefetchQuery(accountsQueryOptions);
    opts.context.queryClient.prefetchQuery(creditScoreQueryOptions);
  },
  component: IndexPage,
  head: () => ({
    meta: [
      {
        title: "Dashboard",
      },
    ],
  }),
});

function IndexPage() {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto p-6 pt-8">
          <h1 className="text-2xl font-bold">Welcome back, Sarah</h1>
          <p className="text-blue-100 mt-1">Your financial summary</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 -mt-4">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { label: "Transfer", href: "/move-money" as const },
                { label: "Pay Bills", href: "/move-money" as const },
                { label: "Deposit", href: null },
                { label: "Investments", href: null },
              ] as const
            ).map((action) => {
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <span className="text-blue-600 text-xl">+</span>
                  </div>
                  <span className="text-xs text-gray-700">{action.label}</span>
                </>
              );
              const className =
                "flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors";
              return action.href ? (
                <Link
                  key={action.label}
                  to={action.href}
                  className={className}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={action.label}
                  className={className}
                  onClick={() => alert("Coming soon!")}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Your Accounts
        </h2>
        <Suspense fallback={<AccountsSkeleton />}>
          <AccountsContent />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Financial Health
          </h2>
          <Suspense fallback={<CreditScoreSkeleton />}>
            <CreditScore />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function AccountsContent() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  return (
    <div className="grid gap-3 p-2">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
      case "CHECKING":
        return "💰";
      case "SAVINGS":
        return "🏦";
      case "CREDIT":
        return "💳";
    }
  };

  return (
    <WrappedLink
      to="/accounts/index/$accountId"
      params={{ accountId: account.id }}
    >
      <Card className="p-4 active:bg-gray-100 transition-colors duration-150">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{getAccountIcon(account.type)}</span>
          <div className="font-medium text-zinc-900">{account.displayName}</div>
        </div>
        <div className="text-2xl font-semibold text-zinc-900">
          $
          {account.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </div>
        {account.type === "CREDIT" && (
          <div className="text-sm text-zinc-500 mt-1">
            ${account.availableCredit.toLocaleString()} available
          </div>
        )}
      </Card>
    </WrappedLink>
  );
}

/** Skeleton for the accounts loading state */
function AccountsSkeleton() {
  return (
    <div className="grid gap-3 p-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            {/* Icon placeholder */}
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            {/* Account name */}
            <div className="h-5 w-32 bg-gray-200 rounded"></div>
          </div>
          {/* Balance */}
          <div className="h-8 w-36 bg-gray-200 rounded"></div>
          {/* Credit available - show on last card */}
          {i === 2 && <div className="h-4 w-28 bg-gray-200 rounded mt-1"></div>}
        </Card>
      ))}
    </div>
  );
}
