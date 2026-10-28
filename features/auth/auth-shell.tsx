import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BrandMark } from "@/components/brand-mark"

type AuthShellProps = { title: string; subtitle: string; children: React.ReactNode }

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const insets = useSafeAreaInsets()

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }}>
        <View className="w-full max-w-[480px] gap-8 self-center px-4">
          <BrandMark />
          <View className="gap-1">
            <Text accessibilityRole="header" className="text-2xl font-semibold text-foreground">
              {title}
            </Text>
            <Text className="text-base text-muted-foreground">{subtitle}</Text>
          </View>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
