import { Text, View } from "react-native"

import { HalfGauge } from "@/components/charts/half-gauge"
import { Card } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { useTransactionsSummary } from "@/hooks/use-transactions"
import { getMonthRange } from "@/lib/date-range"
import { percentSaved } from "@/lib/dashboard"
import { calcDeltaPct } from "@/lib/format"

export function FinancialHealthCard() {
  const formatCurrency = useFormatCurrency()
  const current = useTransactionsSummary(getMonthRange(0))
  const previous = useTransactionsSummary(getMonthRange(1))

  const net = current.data?.net ?? 0
  const saved = percentSaved(net, current.data?.income ?? 0)
  const deltaPct = calcDeltaPct(net, previous.data?.net ?? 0)
  const good = deltaPct >= 0

  return (
    <Card title="Financial health">
      {current.isLoading || previous.isLoading ? (
        <Skeleton height={140} />
      ) : current.isError || previous.isError ? (
        <ErrorState
          error={current.error ?? previous.error}
          fallback="Couldn't load financial health."
          onRetry={() => {
            current.refetch()
            previous.refetch()
          }}
        />
      ) : (
        <View className="items-center gap-1">
          <View className="items-start self-stretch">
            <Text className="text-2xl font-semibold text-foreground tabular-nums">
              {formatCurrency(net)}
            </Text>
            <Text
              className={good ? "text-xs font-medium text-status-good" : "text-xs font-medium text-status-critical"}>
              {`${good ? "+" : "−"}${Math.abs(deltaPct).toFixed(1)}% from last month`}
            </Text>
          </View>
          <HalfGauge percent={saved} label={`${saved}% of this month's income saved`} />
          <Text className="text-center text-xs text-muted-foreground">Of this month's income saved</Text>
        </View>
      )}
    </Card>
  )
}
