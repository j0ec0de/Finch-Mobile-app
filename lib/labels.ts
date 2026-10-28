import type { AccountType } from "@/lib/accounts"

export const accountTypeLabels: Record<AccountType, string> = {
  cash: "Cash",
  bank: "Bank",
  credit_card: "Credit card",
  wallet: "Wallet",
  investment: "Investment",
  other: "Other",
}
