import * as React from "react";
import { Suspense } from "react";
import { createFileRoute, Link, LinkProps } from "@tanstack/react-router";
import { accountsQueryOptions } from "../lib/api/fake-api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  loader: (opts) => {
    opts.context.queryClient.prefetchQuery(accountsQueryOptions);
  },
  component: HomeLoadingWrapper,
});

function HomeLoadingWrapper() {
  return (
    <div className="p-2">
      <h1>Welcome Home!</h1>
      <h2 className="p-2 text-4xl font-semibold text-gray-600">Accounts</h2>
      <Suspense fallback={<div className="p-4">Loading accounts...</div>}>
        <HomeComponent />
      </Suspense>
    </div>
  );
}

function HomeComponent() {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  return (
    <>
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
    </>
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
        <div className="font-semibold txt-xl">{title}</div>
        <div>{children}</div>
      </div>
    </Link>
  );
}
