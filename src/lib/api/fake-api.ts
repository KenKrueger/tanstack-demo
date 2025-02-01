import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: "posted" | "pending";
  merchantName: string;
  merchantCategory: string;
}

interface BaseAccount {
  id: string;
  displayName: string;
  accountNumber: string; // Last 4 digits only
  routingNumber: string;
  balance: number;
  availableBalance: number;
  type: "CHECKING" | "SAVINGS" | "CREDIT";
  status: "ACTIVE" | "RESTRICTED" | "CLOSED";
  lastUpdated: string;
  transactions: Transaction[];
}

interface CheckingAccount extends BaseAccount {
  type: "CHECKING";
  overdraftProtection: boolean;
  monthlyFee: number;
  minimumBalance: number;
}

interface SavingsAccount extends BaseAccount {
  type: "SAVINGS";
  apy: number;
  interestYtd: number;
  nextInterestPayment: string;
}

interface CreditAccount extends BaseAccount {
  type: "CREDIT";
  creditLimit: number;
  availableCredit: number;
  apr: number;
  dueDate: string;
  minimumPayment: number;
  rewardsBalance: number;
}

export type Account = CheckingAccount | SavingsAccount | CreditAccount;

const mockAccounts: Account[] = [
  {
    id: "chk_1234",
    displayName: "Essential Checking",
    accountNumber: "****1234",
    routingNumber: "021000021",
    balance: 2547.83,
    availableBalance: 2547.83,
    type: "CHECKING",
    status: "ACTIVE",
    lastUpdated: new Date().toISOString(),
    overdraftProtection: true,
    monthlyFee: 0,
    minimumBalance: 500,
    transactions: [
      {
        id: "tx_1",
        date: "2024-03-15T10:30:00Z",
        description: "Whole Foods Market",
        amount: -84.32,
        category: "Groceries",
        status: "posted",
        merchantName: "Whole Foods",
        merchantCategory: "GROCERY_STORES",
      },
    ],
  },
  {
    id: "sav_5678",
    displayName: "High-Yield Savings",
    accountNumber: "****5678",
    routingNumber: "021000021",
    balance: 15780.45,
    availableBalance: 15780.45,
    type: "SAVINGS",
    status: "ACTIVE",
    lastUpdated: new Date().toISOString(),
    apy: 4.25,
    interestYtd: 234.12,
    nextInterestPayment: "2024-04-01T00:00:00Z",
    transactions: [],
  },
  {
    id: "cc_9012",
    displayName: "Rewards Plus Card",
    accountNumber: "****9012",
    routingNumber: "",
    balance: 1250.84,
    availableBalance: 0,
    type: "CREDIT",
    status: "ACTIVE",
    lastUpdated: new Date().toISOString(),
    creditLimit: 12000,
    availableCredit: 10749.16,
    apr: 18.99,
    dueDate: "2024-04-15T00:00:00Z",
    minimumPayment: 35,
    rewardsBalance: 12450,
    transactions: [],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomLatency = () => {
  const min = 300; // Minimum 300ms
  const max = 2000; // Maximum 2s
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// API functions
export async function fetchAccounts(): Promise<Account[]> {
  await delay(getRandomLatency());
  return mockAccounts;
}

export async function fetchAccountById(
  id: string
): Promise<Account | undefined> {
  await delay(getRandomLatency());
  return mockAccounts.find((account) => account.id === id);
}

// TanStack Query Hooks
export const accountsQueryOptions = queryOptions({
  queryKey: ["accounts"] as const,
  queryFn: fetchAccounts,
  staleTime: 1000 * 60 * 5,
});

export const accountQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["account", id] as const,
    queryFn: () => fetchAccountById(id),
    staleTime: 1000 * 60 * 5,
  });

export function useAccounts() {
  return useQuery(accountsQueryOptions);
}

export function useAccount(id: string) {
  return useQuery(accountQueryOptions(id));
}

export async function prefetchAccounts(queryClient: QueryClient) {
  await queryClient.prefetchQuery(accountsQueryOptions);
}

export async function prefetchAccount(queryClient: QueryClient, id: string) {
  await queryClient.prefetchQuery(accountQueryOptions(id));
}
