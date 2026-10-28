import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Plus } from "lucide-react-native"
import { useState } from "react"
import { Pressable } from "react-native"

import { Screen } from "@/components/layout/screen"
import { BalanceOverviewCard } from "@/features/dashboard/balance-overview-card"
import { CostAnalysisCard } from "@/features/dashboard/cost-analysis-card"
import { FinancialHealthCard } from "@/features/dashboard/financial-health-card"
import { GoalTrackerCard } from "@/features/dashboard/goal-tracker-card"
import { SpendingLimitCard } from "@/features/dashboard/spending-limit-card"
import { TransactionHistoryCard } from "@/features/dashboard/transaction-history-card"
import { useTheme } from "@/hooks/use-theme"

export function DashboardScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const queryClient = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    try {
      await queryClient.invalidateQueries()
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Screen
      title="Home"
      refreshing={refreshing}
      onRefresh={refresh}
      action={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
          hitSlop={12}
          onPress={() => router.push("/transactions/new")}>
          <Plus size={24} color={colors.foreground} />
        </Pressable>
      }>
      <BalanceOverviewCard />
      <SpendingLimitCard />
      <TransactionHistoryCard />
      <GoalTrackerCard />
      <CostAnalysisCard />
      <FinancialHealthCard />
    </Screen>
  )
}
