import * as React from "react";
import { Suspense } from "react";
import { Form } from "../../components/ui/Form";
import { Button } from "../../components/ui/Button";
import { Select, SelectItem } from "../../components/ui/Select";
import { TextField } from "../../components/ui/TextField";
import { useSuspenseQuery } from "@tanstack/react-query";
import { accountsQueryOptions, type Account } from "../../lib/api/fake-api";

function TransferForm({
  accountId,
  mode = "transfer",
  onClose,
}: {
  accountId: string;
  mode?: "transfer" | "payment";
  onClose?: () => void;
}) {
  return (
    <Suspense fallback={<TransferFormSkeleton />}>
      <TransferFormReady accountId={accountId} mode={mode} onClose={onClose} />
    </Suspense>
  );
}

function TransferFormReady({
  accountId,
  mode = "transfer",
  onClose,
}: {
  accountId: string;
  mode?: "transfer" | "payment";
  onClose?: () => void;
}) {
  const { data: accounts } = useSuspenseQuery(accountsQueryOptions);

  // Filter out credit accounts — can't transfer from/to credit cards in this flow
  const eligibleAccounts = accounts.filter((a) => a.type !== "CREDIT");

  const initialFrom = eligibleAccounts.some((a) => a.id === accountId)
    ? accountId
    : "";

  const [fromAccount, setFromAccount] = React.useState<string>(initialFrom);
  const [toAccount, setToAccount] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [errors, setErrors] = React.useState<{
    from?: string;
    to?: string;
    amount?: string;
    same?: string;
  }>({});

  const formatAccountOption = (account: Account) =>
    `${account.displayName} - $${account.availableBalance.toLocaleString(
      "en-US",
      { minimumFractionDigits: 2 }
    )}`;

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!fromAccount) newErrors.from = "Please select a source account.";
    if (!toAccount) newErrors.to = "Please select a destination account.";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = "Please enter a valid amount.";
    if (fromAccount && toAccount && fromAccount === toAccount)
      newErrors.same = "Source and destination accounts must be different.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onClose?.();
  };

  const isPayment = mode === "payment";
  const heading = isPayment ? "Make a Payment" : "Transfer Money";
  const submitLabel = isPayment ? "Pay" : "Transfer";

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">{heading}</h2>
      {errors.same && (
        <p className="text-red-600 text-sm mb-2">{errors.same}</p>
      )}
      <Select
        label="Transfer from"
        selectedKey={fromAccount || null}
        onSelectionChange={(key) => setFromAccount(String(key))}
      >
        {eligibleAccounts.map((account) => (
          <SelectItem key={account.id} id={account.id}>
            {formatAccountOption(account)}
          </SelectItem>
        ))}
      </Select>
      {errors.from && <p className="text-red-600 text-sm">{errors.from}</p>}
      <Select
        label="Transfer to"
        placeholder="Select an account"
        selectedKey={toAccount || null}
        onSelectionChange={(key) => setToAccount(String(key))}
      >
        {eligibleAccounts.map((account) => (
          <SelectItem key={account.id} id={account.id}>
            {formatAccountOption(account)}
          </SelectItem>
        ))}
      </Select>
      {errors.to && <p className="text-red-600 text-sm">{errors.to}</p>}
      <TextField
        inputMode="decimal"
        label="Amount"
        value={amount}
        onChange={setAmount}
      />
      {errors.amount && (
        <p className="text-red-600 text-sm">{errors.amount}</p>
      )}
      <Button type="submit">{submitLabel}</Button>
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
