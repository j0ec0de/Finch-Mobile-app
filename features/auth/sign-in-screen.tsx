import { Link } from "expo-router"
import { useRef } from "react"
import { Controller } from "react-hook-form"
import { Text, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Input, type InputRef } from "@/components/ui/input"
import { AuthShell } from "@/features/auth/auth-shell"
import { useSignInForm } from "@/features/auth/use-sign-in-form"

export function SignInScreen() {
  const { form, submit, serverError, isSubmitting } = useSignInForm()
  const passwordRef = useRef<InputRef>(null)

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your finances.">
      <View className="gap-4">
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              ref={passwordRef}
              label="Password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          )}
        />
        {serverError ? <Text className="text-sm text-destructive">{serverError}</Text> : null}
        <Button
          title={isSubmitting ? "Signing in…" : "Sign in"}
          loading={isSubmitting}
          onPress={submit}
        />
        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-muted-foreground">No account?</Text>
          <Link href="/sign-up" className="text-sm font-medium text-foreground">
            Create one
          </Link>
        </View>
      </View>
    </AuthShell>
  )
}
