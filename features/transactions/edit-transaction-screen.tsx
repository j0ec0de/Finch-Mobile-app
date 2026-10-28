import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"

import { ErrorState } from "@/components/ui/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionForm } from "@/features/transactions/transaction-form"
import { useTransaction } from "@/hooks/use-transactions"

export function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading, isError, error, refetch } = useTransaction(Number(id))

  if (isLoading) {
    return (
      <View className="flex-1 gap-4 bg-background p-4">
        <Skeleton height={44} />
        <Skeleton height={44} />
        <Skeleton height={44} />
      </View>
    )
  }
  if (isError || !data) {
    return (
      <View className="flex-1 bg-background p-4">
        <ErrorState error={error} fallback="Couldn't load this transaction." onRetry={refetch} />
      </View>
    )
  }
  return <TransactionForm transaction={data} />
}
