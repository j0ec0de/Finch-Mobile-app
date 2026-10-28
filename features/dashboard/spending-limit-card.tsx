import { Text } from "react-native"

import { Card } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { Meter } from "@/components/ui/meter"
import { Skeleton } from "@/components/ui/skeleton"
import { useBudgets } from "@/hooks/use-budgets"
import { useFormatCurrency } from "@/hooks/use-display-currency"

export function SpendingLimitCard() {
  const formatCurrency = useFormatCurrency()
  const { data: budgets, isLoading, isError, error, refetch } = useBudgets()

  const monthly = (budgets ?? []).filter((b) => b.period === "monthly")
  const spent = monthly.reduce((sum, b) => sum + b.spent, 0)
  const limit = monthly.reduce((sum, b) => sum + Number(b.limit), 0)

  return (
    <Card title="Monthly spending limit">
      {isLoading ? (
        <Skeleton height={36} />
      ) : isError ? (
        <ErrorState error={error} fallback="Couldn't load budgets." onRetry={refetch} />
      ) : limit > 0 ? (
        <Meter
          value={spent}
          max={limit}
          leftLabel={`${formatCurrency(spent)} spent`}
          rightLabel={`of ${formatCurrency(limit)}`}
        />
      ) : (
        <Text className="text-sm text-muted-foreground">No monthly budgets set yet.</Text>
      )}
    </Card>
  )
}
