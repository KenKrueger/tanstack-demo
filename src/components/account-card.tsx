import { Account } from "../lib/api/fake-api";
import { WrappedLink } from "./wrapped-link";

const cardColors = {
  CHECKING: "from-blue-500 to-cyan-400",
  SAVINGS: "from-emerald-500 to-teal-400",
  CREDIT: "from-purple-600 to-indigo-500",
};

export function AccountCard({ account }: { account: Account }) {
  const cardColor = cardColors[account.type] || "from-gray-700 to-gray-800";
  const isCredit = account.type === "CREDIT";

  return (
    <WrappedLink
      preload="intent"
      to={`/accounts/index/$accountId`}
      params={{ accountId: account.id }}
      className="block no-underline"
    >
      <div
        className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md`}
      >
        <div className={`bg-gradient-to-r ${cardColor} p-6 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold mb-1">{account.displayName}</h3>
              <p className="text-white/70 text-sm">{account.accountNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-white/70">
                {isCredit ? "Available Credit" : "Available Balance"}
              </p>
              <p className="text-xl font-bold">
                $
                {isCredit
                  ? account.availableCredit?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })
                  : account.availableBalance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">
                {isCredit ? "Credit Limit" : "Current Balance"}
              </span>
              <span className="font-medium">
                $
                {isCredit
                  ? account.creditLimit?.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })
                  : account.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
              </span>
            </div>

            {isCredit && (
              <div className="mt-2 w-full bg-white/20 rounded-full h-1.5">
                <div
                  className="bg-white h-1.5 rounded-full"
                  style={{
                    width: `${
                      (account.availableCredit / account.creditLimit) * 100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {isCredit
              ? `Due ${new Date(account.dueDate).toLocaleDateString()}`
              : "View details"}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </WrappedLink>
  );
}
