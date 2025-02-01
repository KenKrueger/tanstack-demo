import { Account, Transaction } from "./fake-api";

// Use these consistent arrays for generating categories
const CATEGORIES = {
  CHECKING: ["GROCERY", "DINING", "TRANSPORT", "SHOPPING"] as const,
  SAVINGS: ["DEPOSITS", "PAYMENTS"] as const,
  CREDIT: ["SHOPPING", "ENTERTAINMENT", "DINING", "TRANSPORT"] as const,
} as const;

const MERCHANTS = {
  GROCERY: ["Whole Foods", "Trader Joe's", "Kroger", "Safeway"],
  DINING: ["Starbucks", "Chipotle", "McDonald's", "Local Restaurant"],
  TRANSPORT: ["Uber", "Lyft", "Shell", "Chevron", "ExxonMobil"],
  SHOPPING: ["Amazon", "Target", "Walmart", "Best Buy"],
  UTILITIES: ["AT&T", "Verizon", "PG&E", "Water & Power"],
  ENTERTAINMENT: ["Netflix", "Spotify", "Apple", "Steam"],
  HEALTH: ["CVS Pharmacy", "Walgreens", "Quest Diagnostics"],
  DEPOSITS: ["Direct Deposit", "ATM Deposit", "Mobile Deposit", "Transfer In"],
  PAYMENTS: ["Bill Pay", "Auto Pay", "Payment Thank You", "Online Payment"],
} as const;

const generateTransaction = (
  startDate: Date,
  endDate: Date,
  type: Account["type"]
): Transaction => {
  // Random date between startDate and endDate
  const date = new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  );

  // Choose a valid category from CATEGORIES[type]
  const validCategories = CATEGORIES[type];
  const category =
    validCategories[Math.floor(Math.random() * validCategories.length)];

  // Decide on amount & whether it’s debit/credit
  let amount: number;
  let isDebit: boolean;

  switch (type) {
    case "CHECKING":
      amount = Math.floor(Math.random() * 200) + 10;
      isDebit = Math.random() > 0.2; // ~80% are debits
      break;
    case "SAVINGS":
      amount = Math.floor(Math.random() * 1000) + 100;
      isDebit = Math.random() > 0.8; // ~20% are debits
      break;
    case "CREDIT":
      amount = Math.floor(Math.random() * 300) + 20;
      isDebit = true; // All purchases are debits on credit
      break;
  }

  // Pick a merchant from the chosen category
  const merchants = MERCHANTS[category];
  const merchantName = merchants[Math.floor(Math.random() * merchants.length)];

  return {
    id: `tx_${Math.random().toString(36).slice(2)}`,
    date: date.toISOString(),
    description: `${merchantName} ${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`,
    amount: isDebit ? -amount : amount,
    category,
    status: Math.random() > 0.1 ? "posted" : "pending",
    merchantName,
    merchantCategory: category,
  };
};

export const generateTransactions = (
  accountType: "CHECKING" | "SAVINGS" | "CREDIT"
): Transaction[] => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  // Generate 20 transactions in date descending order
  return Array.from({ length: 20 }, () =>
    generateTransaction(startDate, endDate, accountType)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
