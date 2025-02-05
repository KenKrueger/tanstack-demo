import * as React from "react";
import { Suspense } from "react";
import { createFileRoute, Link, LinkProps } from "@tanstack/react-router";
import {
  accountsQueryOptions,
  creditScoreQueryOptions,
} from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditScore, CreditScoreSkeleton } from "../components/credit-score";
import { Card } from "../components/card";
import { WrappedLink } from "../components/wrapped-link";

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
    <div className="min-h-screen ">
      <header className="p-4">
        <h1 className="text-4xl font-semibold text-zinc-800">Home</h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Separate Suspense boundaries for accounts and credit score */}
        <Suspense fallback={<AccountsSkeleton />}>
          <AccountsContent />
        </Suspense>
        <div className="mt-8">
          <Suspense fallback={<CreditScoreSkeleton />}>
            <CreditScore />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function AccountsContent() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  return (
    <div className="grid grid-cols-1 gap-4">
      {accounts?.map((account) => (
        <AccountCard
          key={account.id}
          to={`/accounts/index/$accountId`}
          params={{ accountId: account.id }}
          title={account.displayName}
        >
          <div>
            Balance: $
            {account.balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </div>
        </AccountCard>
      ))}
    </div>
  );
}

interface AccountCardProps {
  title: string;
  children: React.ReactNode;
  to: string;
  params: { accountId: string };
}
function AccountCard({ title, children, to, params }: AccountCardProps) {
  return (
    <WrappedLink to={to} params={params}>
      <Card className="cursor-pointer hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-100 transition-colors duration-150 outline-none focus:ring-2 focus:ring-gray-300">
        <div className="font-semibold text-xl mb-1">{title}</div>
        <div>{children}</div>
      </Card>
    </WrappedLink>
  );
}

/** Skeleton for the accounts loading state */
function AccountsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card
            key={i}
            className="p-4 cursor-pointer hover:bg-gray-100 focus-visible:bg-gray-100 active:bg-gray-100 transition-colors duration-150 outline-none focus:ring-2 focus:ring-gray-300 animate-pulse"
          >
            {/* Mimic title */}
            <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
            {/* Mimic balance */}
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    </div>
  );
}
