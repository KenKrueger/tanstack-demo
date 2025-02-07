import * as React from "react";
import { Suspense } from "react";
import { Form } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Select, SelectItem } from "../../components/ui/Select";
import { TextField } from "../../components/ui/TextField";
import { useSuspenseQuery } from "@tanstack/react-query";
import { accountsQueryOptions, type Account } from "../../lib/api/fake-api";

function TransferForm({ accountId }: { accountId: string }) {
  return (
    <Suspense fallback={<TransferFormSkeleton />}>
      <TransferFormReady accountId={accountId} />
    </Suspense>
  );
}

function TransferFormReady({ accountId }: { accountId: string }) {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);
  const [fromAccount, setFromAccount] = React.useState(accountId);

  const formatAccountOption = (account: Account) =>
    `${account.displayName} - $${account.availableBalance.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
      }
    )}`;

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-lg font-semibold mb-4">Transfer Money</h2>
      <Select label="Transfer from">
        {accounts
          .filter((account) => account.id !== fromAccount)
          .map((account) => (
            <SelectItem key={account.id}>
              {formatAccountOption(account)}
            </SelectItem>
          ))}
      </Select>
      <Select label="Transfer to" placeholder="Select an account">
        {accounts
          .filter((account) => account.id !== fromAccount)
          .map((account) => (
            <SelectItem key={account.id}>
              {formatAccountOption(account)}
            </SelectItem>
          ))}
      </Select>
      <TextField inputMode="decimal" label="Amount" />
      <Button type="submit">Transfer</Button>
    </Form>
  );
}

function TransferFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-full bg-gray-200 rounded" />
      <div className="h-10 w-24 bg-gray-200 rounded" />
    </div>
  );
}

export { TransferForm };
