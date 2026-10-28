import { Controller } from "react-hook-form"
import { Text } from "react-native"

import { SheetScreen } from "@/components/layout/sheet-screen"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { useAccountForm } from "@/features/accounts/use-account-form"
import { accountTypes, currencies, type Account } from "@/lib/accounts"
import { accountTypeLabels } from "@/lib/labels"

const typeOptions = accountTypes.map((t) => ({ value: t, label: accountTypeLabels[t] }))
const currencyOptions = currencies.map((c) => ({ value: c.code, label: `${c.code} · ${c.label}` }))

export function AccountForm({ account }: { account?: Account }) {
  const { form, submit, remove, serverError, isSubmitting, isDeleting } = useAccountForm(account)

  return (
    <SheetScreen>
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
            returnKeyType="done"
          />
        )}
      />
      <Controller
        control={form.control}
        name="type"
        render={({ field, fieldState }) => (
          <Select
            label="Type"
            value={field.value}
            options={typeOptions}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="currency"
        render={({ field, fieldState }) => (
          <Select
            label="Currency"
            value={field.value}
            options={currencyOptions}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      {account ? null : (
        <Controller
          control={form.control}
          name="balance"
          render={({ field, fieldState }) => (
            <Input
              label="Starting balance"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          )}
        />
      )}
      {serverError ? <Text className="text-sm text-destructive">{serverError}</Text> : null}
      <Button
        title={isSubmitting ? "Saving…" : account ? "Save changes" : "Add account"}
        loading={isSubmitting}
        onPress={submit}
      />
      {account ? (
        <Button
          title={isDeleting ? "Deleting…" : "Delete account"}
          variant="outline"
          loading={isDeleting}
          onPress={remove}
        />
      ) : null}
    </SheetScreen>
  )
}
