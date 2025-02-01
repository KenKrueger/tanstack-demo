import * as React from "react";
import { Suspense } from "react";
import { createFileRoute, Link, LinkProps } from "@tanstack/react-router";
import {
  accountsQueryOptions,
  creditScoreQueryOptions,
} from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreditScore, CreditScoreSkeleton } from "../components/CreditScore";
import { CreditCard } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: (opts) => {
    opts.context.queryClient.prefetchQuery(accountsQueryOptions);
    opts.context.queryClient.prefetchQuery(creditScoreQueryOptions);
  },
  component: HomeLoadingWrapper,
});

function HomeLoadingWrapper() {
  return (
    <div className="p-2">
      <h1>Welcome Home!</h1>
      <h2 className="p-2 text-4xl font-semibold text-gray-600">Accounts</h2>
      <Suspense fallback={<AccountsSkeleton />}>
        <HomeComponent />
      </Suspense>
    </div>
  );
}

function HomeComponent() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            to="/accounts/index/$accountId"
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
      <Suspense fallback={<CreditScoreSkeleton />}>
        <CreditScore />
      </Suspense>
    </div>
  );
}

interface AccountCardProps extends LinkProps {
  title: string;
  children: React.ReactNode;
}
function AccountCard({ title, children, ...rest }: AccountCardProps) {
  return (
    <Link {...rest}>
      <div className="flex flex-col border border-gray-300 rounded-lg p-4">
        <div className="font-semibold text-xl">{title}</div>
        <div>{children}</div>
      </div>
    </Link>
  );
}

/** Skeleton for loading state */
function AccountsSkeleton() {
  // You could dynamically calculate how many skeleton cards
  // to show, but here we’ll just hardcode a few placeholders.
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col border border-gray-300 rounded-lg p-4 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}
