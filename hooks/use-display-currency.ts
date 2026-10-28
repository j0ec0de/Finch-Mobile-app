import { useAccounts } from "@/hooks/use-accounts"
import { formatCurrency } from "@/lib/format"

/**
 * Budgets, goals and the dashboard/analytics totals aren't tied to one account,
 * so they use the currency most of the user's accounts are in (first account
 * wins a tie). No conversion is done between currencies.
 */
export function useDisplayCurrency() {
  const { data: accounts } = useAccounts()
  const counts = new Map<string, number>()
  for (const account of accounts ?? []) {
    counts.set(account.currency, (counts.get(account.currency) ?? 0) + 1)
  }

  let currency = "USD"
  let best = 0
  for (const [code, count] of counts) {
    if (count > best) {
      currency = code
      best = count
    }
  }
  return currency
}

export function useFormatCurrency() {
  const currency = useDisplayCurrency()
  return (value: number) => formatCurrency(value, currency)
}
