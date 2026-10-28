import { useState } from "react"
import { Text, View } from "react-native"

import { ChartLegend } from "@/components/charts/chart-legend"
import { IncomeExpenseBars } from "@/components/charts/income-expense-bars"
import { Card } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Skeleton } from "@/components/ui/skeleton"
import { StatTile } from "@/components/ui/stat-tile"
import { useAccounts } from "@/hooks/use-accounts"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { useTheme } from "@/hooks/use-theme"
import {
  useTransactions,
  useTransactionsSummary,
  useTransactionsTrend,
} from "@/hooks/use-transactions"
import { getLastNDaysRange, getMonthRange } from "@/lib/date-range"
import { buildDailyFlow } from "@/lib/dashboard"
import { calcDeltaPct } from "@/lib/format"

const RANGE_OPTIONS = [
  { value: "7d", label: "7d", days: 7, months: 0 },
  { value: "30d", label: "30d", days: 30, months: 0 },
  { value: "6m", label: "6m", days: 7, months: 6 },
  { value: "12m", label: "12m", days: 7, months: 12 },
] as const

type RangeValue = (typeof RANGE_OPTIONS)[number]["value"]

export function BalanceOverviewCard() {
  const formatCurrency = useFormatCurrency()
  const { colors } = useTheme()
  const [range, setRange] = useState<RangeValue>("7d")
  const option = RANGE_OPTIONS.find((o) => o.value === range) ?? RANGE_OPTIONS[0]
  const isMonthly = option.months > 0

  const accounts = useAccounts()
  const recent = useTransactions({ ...getLastNDaysRange(option.days), limit: 200 })
  const trend = useTransactionsTrend(option.months)
  const current = useTransactionsSummary(getMonthRange(0))
  const previous = useTransactionsSummary(getMonthRange(1))

  const isLoading =
    accounts.isLoading ||
    current.isLoading ||
    previous.isLoading ||
    (isMonthly ? trend.isLoading : recent.isLoading)
  const error = accounts.error ?? current.error ?? previous.error ?? (isMonthly ? trend.error : recent.error)

  const balance = (accounts.data ?? []).reduce((sum, a) => sum + Number(a.balance), 0)
  const chartData = isMonthly
    ? trend.data.map((p) => ({ label: p.month, income: p.income, expenses: p.expense }))
    : buildDailyFlow(recent.data?.data ?? [], option.days).map((d) => ({
        label: d.day,
        income: d.income,
        expenses: d.expenses,
      }))
  const income = current.data?.income ?? 0
  const expense = current.data?.expense ?? 0
  const net = current.data?.net ?? 0
  const totalIncome = chartData.reduce((s, d) => s + d.income, 0)
  const totalExpenses = chartData.reduce((s, d) => s + d.expenses, 0)

  return (
    <Card title="Balance overview">
      {error ? (
        <ErrorState
          error={error}
          fallback="Couldn't load your balance."
          onRetry={() => {
            accounts.refetch()
            current.refetch()
            previous.refetch()
            recent.refetch()
          }}
        />
      ) : isLoading ? (
        <View className="gap-4">
          <Skeleton height={36} width={160} />
          <Skeleton height={200} />
        </View>
      ) : (
        <View className="gap-4">
          <Text
            accessibilityLabel={`Total balance ${formatCurrency(balance)}`}
            className="text-3xl font-semibold text-foreground tabular-nums">
            {formatCurrency(balance)}
          </Text>
          <SegmentedControl label="Chart range" value={range} options={RANGE_OPTIONS} onChange={setRange} />
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Income ${formatCurrency(totalIncome)}, expenses ${formatCurrency(
              totalExpenses
            )} over the last ${option.value === "7d" ? "7 days" : option.value === "30d" ? "30 days" : option.value === "6m" ? "6 months" : "12 months"}`}>
            <IncomeExpenseBars data={chartData} />
          </View>
          <ChartLegend
            items={[
              { label: "Income", color: colors.chart[0] },
              { label: "Expenses", color: colors.chart[1] },
            ]}
          />
          <View className="flex-row gap-3 border-t border-border pt-4">
            <View className="flex-1">
              <StatTile
                label="Income"
                value={formatCurrency(income)}
                delta={calcDeltaPct(income, previous.data?.income ?? 0)}
              />
            </View>
            <View className="flex-1">
              <StatTile
                label="Expenses"
                value={formatCurrency(expense)}
                delta={calcDeltaPct(expense, previous.data?.expense ?? 0)}
                invertDelta
              />
            </View>
            <View className="flex-1">
              <StatTile
                label="Net"
                value={formatCurrency(net)}
                delta={calcDeltaPct(net, previous.data?.net ?? 0)}
              />
            </View>
          </View>
        </View>
      )}
    </Card>
  )
}
