import { Stack, useRouter } from "expo-router"
import { Plus, Wallet } from "lucide-react-native"
import { FlatList, Pressable, RefreshControl, View } from "react-native"

import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ListRow } from "@/components/ui/list-row"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccounts } from "@/hooks/use-accounts"
import { useTheme } from "@/hooks/use-theme"
import { formatCurrency } from "@/lib/format"
import { accountTypeLabels } from "@/lib/labels"

export function AccountsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { data, isLoading, isError, error, refetch, isRefetching } = useAccounts()

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add account"
              hitSlop={12}
              onPress={() => router.push("/accounts/new")}>
              <Plus size={24} color={colors.foreground} />
            </Pressable>
          ),
        }}
      />
      {isLoading ? (
        <View className="gap-3 p-4">
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
        </View>
      ) : isError ? (
        <View className="p-4">
          <ErrorState error={error} fallback="Couldn't load accounts." onRetry={refetch} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(a) => String(a.id)}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={async () => { await refetch() }} />}
          contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
          ListEmptyComponent={
            <View className="p-4">
              <EmptyState
                icon={<Wallet size={20} color={colors.mutedForeground} />}
                title="No accounts yet"
                description="Add an account to start tracking your money."
                actionLabel="Add account"
                onAction={() => router.push("/accounts/new")}
              />
            </View>
          }
          renderItem={({ item }) => (
            <ListRow
              title={item.name}
              subtitle={`${accountTypeLabels[item.type]} · ${item.currency}`}
              amount={formatCurrency(Number(item.balance), item.currency)}
              icon={<Wallet size={20} color={colors.foreground} />}
              accessibilityHint="Edit account"
              onPress={() => router.push({ pathname: "/accounts/[id]", params: { id: item.id } })}
            />
          )}
        />
      )}
    </View>
  )
}
