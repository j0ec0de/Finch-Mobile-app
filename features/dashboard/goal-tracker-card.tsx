import { Target } from "lucide-react-native"
import { Text, View } from "react-native"

import { Card } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { Meter } from "@/components/ui/meter"
import { Skeleton } from "@/components/ui/skeleton"
import { useFormatCurrency } from "@/hooks/use-display-currency"
import { useGoals } from "@/hooks/use-goals"
import { useTheme } from "@/hooks/use-theme"

export function GoalTrackerCard() {
  const formatCurrency = useFormatCurrency()
  const { colors } = useTheme()
  const { data: goals, isLoading, isError, error, refetch } = useGoals()

  return (
    <Card title="Goal tracker">
      {isLoading ? (
        <View className="gap-4">
          <Skeleton height={44} />
          <Skeleton height={44} />
        </View>
      ) : isError ? (
        <ErrorState error={error} fallback="Couldn't load goals." onRetry={refetch} />
      ) : (goals ?? []).length > 0 ? (
        <View className="gap-5">
          {goals!.map((goal) => {
            const saved = Number(goal.savedAmount)
            const target = Number(goal.targetAmount)
            const remaining = target - saved
            return (
              <View key={goal.id} className="gap-1.5">
                <Text numberOfLines={1} className="text-base font-medium text-foreground">
                  {goal.name}
                </Text>
                <Meter
                  value={saved}
                  max={target}
                  leftLabel={`${formatCurrency(saved)} / ${formatCurrency(target)}`}
                  rightLabel={remaining <= 0 ? "Target reached" : `${formatCurrency(remaining)} left`}
                />
              </View>
            )
          })}
        </View>
      ) : (
        <EmptyState
          icon={<Target size={20} color={colors.mutedForeground} />}
          title="No goals yet"
          description="Savings goals will show up here."
        />
      )}
    </Card>
  )
}
