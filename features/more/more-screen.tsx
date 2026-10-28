import { useRouter } from "expo-router"
import { ChevronRight, LogOut, Wallet } from "lucide-react-native"
import { Pressable, Text, View } from "react-native"

import { Screen } from "@/components/layout/screen"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/hooks/use-theme"
import { confirmDestructive } from "@/lib/confirm"

export function MoreScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user, logout } = useAuth()

  const signOut = async () => {
    if (await confirmDestructive("Sign out?", "You'll need to sign in again.", "Sign out")) logout()
  }

  return (
    <Screen title="More">
      {user ? (
        <View className="gap-0.5">
          <Text className="text-base font-medium text-foreground">{user.name}</Text>
          <Text className="text-sm text-muted-foreground">{user.email}</Text>
        </View>
      ) : null}
      <Card compact className="p-0">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Accounts"
          onPress={() => router.push("/accounts")}
          className="min-h-14 flex-row items-center gap-3 px-4 active:bg-muted">
          <Wallet size={20} color={colors.foreground} />
          <Text className="flex-1 text-base text-foreground">Accounts</Text>
          <ChevronRight size={20} color={colors.mutedForeground} />
        </Pressable>
      </Card>
      <Card compact className="p-0">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          onPress={signOut}
          className="min-h-14 flex-row items-center gap-3 px-4 active:bg-muted">
          <LogOut size={20} color={colors.destructive} />
          <Text className="flex-1 text-base text-destructive">Sign out</Text>
        </Pressable>
      </Card>
    </Screen>
  )
}
