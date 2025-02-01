import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>

      <h2 className="p-2 text-4xl font-semibold text-gray-600">Accounts</h2>
      <div className="flex flex-col gap-2">
        <AccountCard title="Checking">
          <div>Balance: $1,000.00</div>
        </AccountCard>
        <AccountCard title="Savings">
          <div>Balance: $5,000.00</div>
        </AccountCard>
        <AccountCard title="Visa Credit Card">
          <div>Balance: $323.24</div>
        </AccountCard>
      </div>
    </div>
  );
}

function AccountCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-4">
      <div className="font-semibold txt-xl">{title}</div>
      <div>{children}</div>
    </div>
  );
}
