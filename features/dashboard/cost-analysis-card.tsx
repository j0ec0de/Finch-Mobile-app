import { Text, View } from "react-native"

import { Card } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { useTheme } from "@/hooks/use-theme"
import { useTransactionsByCategory } from "@/hooks/use-transactions"
import { getMonthRange } from "@/lib/date-range"

export function CostAnalysisCard() {
  const formatCurrency = useFormatCurrency()
  const { colors } = useTheme()
  const { data, isLoading, isError, error, refetch } = useTransactionsByCategory(getMonthRange(0))

  const expenses = (data?.data ?? [])
    .filter((c) => c.type === "expense")
    .sort((a, b) => b.total - a.total)
  const total = expenses.reduce((sum, c) => sum + c.total, 0)
  const categories = expenses.map((c, i) => ({
    ...c,
    pct: total > 0 ? Math.round((c.total / total) * 100) : 0,
    color: colors.chart[i % colors.chart.length],
  }))

  return (
    <Card title="Cost analysis">
      {isLoading ? (
        <View className="gap-3">
          <Skeleton height={32} width={120} />
          <Skeleton height={10} />
          <Skeleton height={80} />
        </View>
      ) : isError ? (
        <ErrorState error={error} fallback="Couldn't load spending data." onRetry={refetch} />
      ) : categories.length === 0 ? (
        <Text className="text-sm text-muted-foreground">No expenses yet this month.</Text>
      ) : (
        <View className="gap-4">
          <View>
            <Text className="text-2xl font-semibold text-foreground tabular-nums">
              {formatCurrency(total)}
            </Text>
            <Text className="text-sm text-muted-foreground">Spent this month</Text>
          </View>
          <View
            accessible
            accessibilityRole="image"
            accessibilityLabel={`Spending by category: ${categories
              .map((c) => `${c.categoryName} ${c.pct}%`)
              .join(", ")}`}
            className="h-2.5 flex-row gap-0.5 overflow-hidden rounded-full">
            {categories.map((c) => (
              <View
                key={c.categoryId ?? "uncategorized"}
                style={{ flex: Math.max(c.pct, 1), backgroundColor: c.color }}
              />
            ))}
          </View>
          <View className="gap-2">
            {categories.map((c) => (
              <View key={c.categoryId ?? "uncategorized"} className="flex-row items-center gap-2">
                <View style={{ backgroundColor: c.color }} className="size-2.5 rounded-full" />
                <Text numberOfLines={1} className="flex-1 text-sm text-foreground">
                  {c.categoryName}
                </Text>
                <Text className="text-sm text-muted-foreground tabular-nums">
                  {formatCurrency(c.total)} · {c.pct}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  )
}
