import { Link } from "expo-router"
import { useRef } from "react"
import { Controller } from "react-hook-form"
import { Text, View } from "react-native"

import { Button } from "@/components/ui/button"
import { Input, type InputRef } from "@/components/ui/input"
import { AuthShell } from "@/features/auth/auth-shell"
import { useSignUpForm } from "@/features/auth/use-sign-up-form"

export function SignUpScreen() {
  const { form, submit, serverError, isSubmitting } = useSignUpForm()
  const emailRef = useRef<InputRef>(null)
  const passwordRef = useRef<InputRef>(null)

  return (
    <AuthShell title="Create your account" subtitle="Start tracking your money with Finch.">
      <View className="gap-4">
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Input
              label="Name"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
          )}
        />
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              ref={emailRef}
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
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={submit}
            />
          )}
        />
        {serverError ? <Text className="text-sm text-destructive">{serverError}</Text> : null}
        <Button
          title={isSubmitting ? "Creating account…" : "Create account"}
          loading={isSubmitting}
          onPress={submit}
        />
        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-muted-foreground">Already have an account?</Text>
          <Link href="/sign-in" className="text-sm font-medium text-foreground">
            Sign in
          </Link>
        </View>
      </View>
    </AuthShell>
  )
}
