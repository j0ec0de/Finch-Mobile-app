import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

import { Skeleton } from "@/components/ui/skeleton"
import { AccountForm } from "@/features/accounts/account-form"
import { useAccounts } from "@/hooks/use-accounts"

export function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data, isLoading } = useAccounts()
  const account = data?.find((a) => a.id === Number(id))

  if (isLoading) {
    return (
      <View className="flex-1 gap-4 bg-background p-4">
        <Skeleton height={44} />
        <Skeleton height={44} />
        <Skeleton height={44} />
      </View>
    )
  }
  if (!account) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4">
        <Text className="text-sm text-muted-foreground">This account no longer exists.</Text>
      </View>
    )
  }
  return <AccountForm account={account} />
}
