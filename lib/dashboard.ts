// Pure dashboard calculations, extracted from the web components
// (pages/dashboard/balance-overview-card.tsx, financial-health-card.tsx).

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export type FlowTransaction = {
  type: "income" | "expense"
  amount: string
  occurredAt: string
  transferGroupId: string | null
}

export type FlowPoint = { key: string; day: string; income: number; expenses: number }

/** Income and expenses per day for the last `dayCount` days, transfers excluded. */
export function buildDailyFlow(
  transactions: FlowTransaction[],
  dayCount: number,
  now: Date = new Date()
): FlowPoint[] {
  const days = Array.from({ length: dayCount }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (dayCount - 1 - i))
    return {
      key: date.toDateString(),
      day:
        dayCount <= 7
          ? WEEKDAY_LABELS[date.getDay()]
          : `${date.getDate()}/${date.getMonth() + 1}`,
      income: 0,
      expenses: 0,
    }
  })

  for (const transaction of transactions) {
    if (transaction.transferGroupId !== null) continue
    const key = new Date(transaction.occurredAt).toDateString()
    const bucket = days.find((d) => d.key === key)
    if (!bucket) continue
    const amount = Number(transaction.amount)
    if (transaction.type === "income") bucket.income += amount
    else bucket.expenses += amount
  }

  return days
}

/** Share of income left after expenses, clamped to 0-100. */
export function percentSaved(net: number, income: number) {
  if (income <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((net / income) * 100)))
}
