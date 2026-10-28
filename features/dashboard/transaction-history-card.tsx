import { useRouter } from "expo-router"
import { Text, View } from "react-native"

import { Card } from "@/components/ui/card"
import { ErrorState } from "@/components/ui/error-state"
import { ListRow } from "@/components/ui/list-row"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccounts } from "@/hooks/use-accounts"
import { useTransactions } from "@/hooks/use-transactions"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/format-date"

export function TransactionHistoryCard() {
  const router = useRouter()
  const { data, isLoading, isError, error, refetch } = useTransactions({ limit: 6 })
  const { data: accounts } = useAccounts()
  const transactions = data?.data ?? []

  return (
    <Card title="Recent transactions" className="px-0">
      {isLoading ? (
        <View className="gap-3 px-4">
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </View>
      ) : isError ? (
        <View className="px-4">
          <ErrorState error={error} fallback="Couldn't load transactions." onRetry={refetch} />
        </View>
      ) : transactions.length === 0 ? (
        <Text className="px-4 text-sm text-muted-foreground">No transactions yet.</Text>
      ) : (
        transactions.map((t) => {
          const isTransfer = t.transferGroupId !== null
          const isIncome = t.type === "income"
          const amount = formatCurrency(
            Number(t.amount),
            accounts?.find((a) => a.id === t.accountId)?.currency
          )
          return (
            <ListRow
              key={t.id}
              title={t.description || (isTransfer ? "Transfer" : isIncome ? "Income" : "Expense")}
              subtitle={formatDate(t.occurredAt)}
              amount={isTransfer ? amount : `${isIncome ? "+" : "−"}${amount}`}
              tone={isTransfer ? "neutral" : isIncome ? "income" : "expense"}
              onPress={() => router.push({ pathname: "/transactions/[id]", params: { id: t.id } })}
            />
          )
        })
      )}
    </Card>
  )
}
