import * as React from "react";
import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
      <PageHeader title="Home" />
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Separate Suspense boundaries for accounts and credit score */}
        <Suspense fallback={<AccountsSkeleton />}>
          <AccountsContent />
        </Suspense>
        <div className="mt-8">
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
