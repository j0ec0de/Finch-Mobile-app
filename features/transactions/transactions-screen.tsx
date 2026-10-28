import { FlashList } from "@shopify/flash-list"
import { useRouter } from "expo-router"
import { ArrowLeftRight, Plus } from "lucide-react-native"
import { useState } from "react"
import { ActivityIndicator, Pressable, RefreshControl, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ListRow } from "@/components/ui/list-row"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { useInfiniteTransactions } from "@/hooks/use-transactions"
import { useTheme } from "@/hooks/use-theme"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/format-date"
import type { Transaction, TransactionType } from "@/lib/transactions"

type AccountFilter = number | "all"
type TypeFilter = TransactionType | "all"

const typeOptions = [
  { value: "all", label: "All types" },
  { value: "expense", label: "Expenses" },
  { value: "income", label: "Income" },
] as const

export function TransactionsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const [accountId, setAccountId] = useState<AccountFilter>("all")
  const [type, setType] = useState<TypeFilter>("all")

  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const query = useInfiniteTransactions({
    accountId: accountId === "all" ? undefined : accountId,
    type: type === "all" ? undefined : type,
  })
  const rows = query.data?.pages.flatMap((p) => p.data) ?? []

  const accountOptions = [
    { value: "all" as AccountFilter, label: "All accounts" },
    ...(accounts ?? []).map((a) => ({ value: a.id as AccountFilter, label: a.name })),
  ]

  const renderRow = (t: Transaction) => {
    const account = accounts?.find((a) => a.id === t.accountId)
    const category = categories?.find((c) => c.id === t.categoryId)
    const isTransfer = t.transferGroupId !== null
    const isIncome = t.type === "income"
    const amount = formatCurrency(Number(t.amount), account?.currency)
    return (
      <ListRow
        title={t.description || category?.name || (isTransfer ? "Transfer" : isIncome ? "Income" : "Expense")}
        subtitle={[category?.name, account?.name, formatDate(t.occurredAt)].filter(Boolean).join(" · ")}
        amount={isTransfer ? amount : `${isIncome ? "+" : "−"}${amount}`}
        tone={isTransfer ? "neutral" : isIncome ? "income" : "expense"}
        accessibilityHint={isTransfer ? "View transfer" : "Edit transaction"}
        onPress={() => router.push({ pathname: "/transactions/[id]", params: { id: t.id } })}
      />
    )
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text accessibilityRole="header" className="text-xl font-medium text-foreground">
          Transactions
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add transaction"
          hitSlop={12}
          onPress={() => router.push("/transactions/new")}>
          <Plus size={24} color={colors.foreground} />
        </Pressable>
      </View>
      <View className="flex-row gap-3 px-4 pb-3">
        <View className="flex-1">
          <Select label="Account" value={accountId} options={accountOptions} onChange={setAccountId} />
        </View>
        <View className="flex-1">
          <Select label="Type" value={type} options={typeOptions} onChange={setType} />
        </View>
      </View>

      {query.isLoading ? (
        <View className="gap-3 px-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={56} />
          ))}
        </View>
      ) : query.isError ? (
        <View className="px-4">
          <ErrorState error={query.error} fallback="Couldn't load transactions." onRetry={query.refetch} />
        </View>
      ) : (
        <FlashList
          data={rows}
          keyExtractor={(t) => String(t.id)}
          renderItem={({ item }) => renderRow(item)}
          refreshControl={
            <RefreshControl refreshing={query.isRefetching && !query.isFetchingNextPage} onRefresh={async () => { await query.refetch() }} />
          }
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage()
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="px-4">
              <EmptyState
                icon={<ArrowLeftRight size={20} color={colors.mutedForeground} />}
                title={accountId === "all" && type === "all" ? "No transactions yet" : "No matching transactions"}
                description={
                  accountId === "all" && type === "all"
                    ? "Add your first transaction to see it here."
                    : "Try a different account or type."
                }
                actionLabel={accountId === "all" && type === "all" ? "Add transaction" : undefined}
                onAction={() => router.push("/transactions/new")}
              />
            </View>
          }
          ListFooterComponent={
            query.isFetchingNextPage ? <ActivityIndicator className="py-4" color={colors.mutedForeground} /> : null
          }
        />
      )}
    </View>
  )
}
