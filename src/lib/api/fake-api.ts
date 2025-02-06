import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import { generateTransactions } from "./getFakeTransactions";

interface CreditScore {
  score: number;
  lastUpdated: string;
  provider: "FICO";
  scoreRange: {
    min: 300;
    max: 850;
  };
}

const mockCreditScore: CreditScore = {
  score: 764,
  lastUpdated: new Date().toISOString(),
  provider: "FICO",
  scoreRange: {
    min: 300,
    max: 850,
  },
};

async function fetchCreditScore(): Promise<CreditScore> {
  await delay(getRandomLatency());
  return mockCreditScore;
}

export const creditScoreQueryOptions = queryOptions({
  queryKey: ["creditScore"] as const,
  queryFn: fetchCreditScore,
  staleTime: 1000 * 60 * 60, // 1 hour
});

export function useCreditScore() {
  return useQuery(creditScoreQueryOptions);
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: "posted" | "pending";
  merchantName: string;
  merchantCategory: string;
}

export interface BaseAccount {
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

export interface CheckingAccount extends BaseAccount {
  type: "CHECKING";
  overdraftProtection: boolean;
  monthlyFee: number;
  minimumBalance: number;
}

export interface SavingsAccount extends BaseAccount {
  type: "SAVINGS";
  apy: number;
  interestYtd: number;
  nextInterestPayment: string;
}

export interface CreditAccount extends BaseAccount {
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
    transactions: generateTransactions("CHECKING"),
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
    transactions: generateTransactions("SAVINGS"),
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
    transactions: generateTransactions("CREDIT"),
  },
];

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  lastLogin: string;
}

const mockProfile: UserProfile = {
  name: "Sarah Johnson",
  email: "s****@example.com",
  phone: "(***) ***-4567",
  address: "1234 Main St, Anytown, USA",
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  lastLogin: "2024-03-15T10:30:00Z",
};

async function fetchProfile(): Promise<UserProfile> {
  await delay(getRandomLatency());
  return mockProfile;
}

export const profileQueryOptions = queryOptions({
  queryKey: ["profile"] as const,
  queryFn: fetchProfile,
  staleTime: 1000 * 60 * 5,
});

export function useProfile() {
  return useQuery(profileQueryOptions);
}

export async function prefetchProfile(queryClient: QueryClient) {
  await queryClient.prefetchQuery(profileQueryOptions);
}

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

export async function fetchAccountById(id: string): Promise<Account> {
  await delay(getRandomLatency());
  const account = mockAccounts.find((account) => account.id === id);
  if (!account) {
    throw new Error("Account not found");
  }
  return account;
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
