import { useRouter } from "expo-router"
import { Controller } from "react-hook-form"
import { Text, View } from "react-native"

import { SheetScreen } from "@/components/layout/sheet-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DateField } from "@/components/ui/date-field"
import { Input } from "@/components/ui/input"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Select } from "@/components/ui/select"
import { useTransactionForm } from "@/features/transactions/use-transaction-form"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { formatCurrency } from "@/lib/format"
import { formatDate } from "@/lib/format-date"
import { transactionTypes, type Transaction } from "@/lib/transactions"

const typeOptions = transactionTypes.map((t) => ({
  value: t,
  label: t === "expense" ? "Expense" : "Income",
}))

type TransactionFormProps = { transaction?: Transaction; defaultAccountId?: number }

export function TransactionForm({ transaction, defaultAccountId }: TransactionFormProps) {
  const router = useRouter()
  const { form, submit, remove, serverError, isSubmitting, isDeleting } = useTransactionForm(
    transaction,
    defaultAccountId
  )
  const { data: accounts } = useAccounts()
  const { data: categories } = useCategories()
  const type = form.watch("type")

  const accountOptions = (accounts ?? []).map((a) => ({
    value: a.id,
    label: `${a.name} · ${a.currency}`,
  }))
  const categoryOptions = (categories ?? [])
    .filter((c) => c.type === type)
    .map((c) => ({ value: c.id, label: c.name }))

  // Transfer legs can't be edited (the API returns 409); show them read-only.
  if (transaction && transaction.transferGroupId !== null) {
    const account = accounts?.find((a) => a.id === transaction.accountId)
    return (
      <SheetScreen>
        <Badge label="Transfer" />
        <View className="gap-1">
          <Text className="text-2xl font-semibold text-foreground tabular-nums">
            {formatCurrency(Number(transaction.amount), account?.currency)}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {transaction.type === "expense" ? "Sent from" : "Received in"} {account?.name ?? "account"} ·{" "}
            {formatDate(transaction.occurredAt)}
          </Text>
          {transaction.description ? (
            <Text className="text-base text-foreground">{transaction.description}</Text>
          ) : null}
        </View>
        <Text className="text-sm text-muted-foreground">
          Transfers can't be edited. Deleting one removes both sides.
        </Text>
        {serverError ? <Text className="text-sm text-destructive">{serverError}</Text> : null}
        <Button
          title={isDeleting ? "Deleting…" : "Delete transfer"}
          variant="outline"
          loading={isDeleting}
          onPress={remove}
        />
      </SheetScreen>
    )
  }

  return (
    <SheetScreen>
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <SegmentedControl
            label="Transaction type"
            value={field.value}
            options={typeOptions}
            onChange={(next) => {
              field.onChange(next)
              const current = form.getValues("categoryId")
              const stillValid = (categories ?? []).some((c) => c.id === current && c.type === next)
              if (!stillValid) form.setValue("categoryId", null)
            }}
          />
        )}
      />
      <Controller
        control={form.control}
        name="amount"
        render={({ field, fieldState }) => (
          <Input
            label="Amount"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            keyboardType="decimal-pad"
            placeholder="0.00"
            returnKeyType="done"
          />
        )}
      />
      <Controller
        control={form.control}
        name="accountId"
        render={({ field, fieldState }) => (
          <Select
            label="Account"
            value={field.value}
            options={accountOptions}
            onChange={field.onChange}
            placeholder={accountOptions.length === 0 ? "No accounts yet" : "Choose an account"}
            error={fieldState.error?.message}
          />
        )}
      />
      {accounts && accounts.length === 0 ? (
        <Button
          title="Add an account first"
          variant="secondary"
          onPress={() => router.replace("/accounts/new")}
        />
      ) : null}
      <Controller
        control={form.control}
        name="categoryId"
        render={({ field }) => (
          <Select
            label="Category (optional)"
            value={field.value}
            options={categoryOptions}
            onChange={field.onChange}
            placeholder="None"
          />
        )}
      />
      <Controller
        control={form.control}
        name="description"
        render={({ field }) => (
          <Input
            label="Description (optional)"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            returnKeyType="done"
          />
        )}
      />
      <Controller
        control={form.control}
        name="occurredAt"
        render={({ field }) => (
          <DateField label="Date" value={field.value} onChange={field.onChange} maximumDate={new Date()} />
        )}
      />
      {serverError ? <Text className="text-sm text-destructive">{serverError}</Text> : null}
      <Button
        title={isSubmitting ? "Saving…" : transaction ? "Save changes" : "Add transaction"}
        loading={isSubmitting}
        onPress={submit}
      />
      {transaction ? (
        <Button
          title={isDeleting ? "Deleting…" : "Delete transaction"}
          variant="outline"
          loading={isDeleting}
          onPress={remove}
        />
      ) : null}
    </SheetScreen>
  )
}
