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
import {
  ArrowLeftRightIcon,
  ReceiptTextIcon,
  LandmarkIcon,
  TrendingUpIcon,
} from "lucide-react";

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
      <header className="mx-auto w-full max-w-4xl px-4 pt-[calc(var(--effective-safe-area-top)+1.25rem)] pb-1 sm:px-6">
        <p className="text-sm text-stone-400 mb-0.5">Good afternoon,</p>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-stone-900 font-display leading-tight">Sarah</h1>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 pt-4 pb-4">
        <div className="bg-white rounded-2xl card-shadow p-4 mb-6">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                {
                  label: "Transfer",
                  href: "/move-money" as const,
                  icon: ArrowLeftRightIcon,
                  bg: "bg-emerald-50",
                  iconColor: "text-emerald-700",
                },
                {
                  label: "Pay Bills",
                  href: "/move-money" as const,
                  icon: ReceiptTextIcon,
                  bg: "bg-amber-50",
                  iconColor: "text-amber-700",
                },
                {
                  label: "Deposit",
                  href: null,
                  icon: LandmarkIcon,
                  bg: "bg-sky-50",
                  iconColor: "text-sky-700",
                },
                {
                  label: "Invest",
                  href: null,
                  icon: TrendingUpIcon,
                  bg: "bg-violet-50",
                  iconColor: "text-violet-700",
                },
              ] as const
            ).map((action) => {
              const Icon = action.icon;
              const inner = (
                <>
                  <div
                    className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center mb-1.5`}
                  >
                    <Icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-stone-600">
                    {action.label}
                  </span>
                </>
              );
              const className =
                "flex flex-col items-center justify-center p-2 rounded-xl hover:bg-stone-50 transition-colors";
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

        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Your Accounts
        </h2>
        <Suspense fallback={<AccountsSkeleton />}>
          <AccountsContent />
        </Suspense>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
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
  const getAccountStyle = (type: Account["type"]) => {
    switch (type) {
      case "CHECKING":
        return { icon: "💰", accent: "bg-emerald-600" };
      case "SAVINGS":
        return { icon: "🏦", accent: "bg-amber-500" };
      case "CREDIT":
        return { icon: "💳", accent: "bg-violet-600" };
    }
  };

  const style = getAccountStyle(account.type);

  return (
    <WrappedLink
      to="/accounts/index/$accountId"
      params={{ accountId: account.id }}
    >
      <Card className="p-4 active:scale-[0.98] transition-all duration-150 relative overflow-hidden">
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${style.accent} rounded-l`}
        />
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{style.icon}</span>
              <div className="font-medium text-stone-800 text-sm">
                {account.displayName}
              </div>
            </div>
            <div className="text-2xl font-semibold text-stone-900 font-display">
              $
              {account.balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            {account.type === "CREDIT" && (
              <div className="text-xs text-stone-500 mt-1">
                ${account.availableCredit.toLocaleString()} available
              </div>
            )}
          </div>
          <div className="text-stone-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              />
            </svg>
          </div>
        </div>
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
