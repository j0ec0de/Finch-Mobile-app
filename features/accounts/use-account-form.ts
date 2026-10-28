import { zodResolver } from "@hookform/resolvers/zod"
import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useCreateAccount, useDeleteAccount, useUpdateAccount } from "@/hooks/use-accounts"
import { ApiError } from "@/lib/api"
import type { Account, UpdateAccountInput } from "@/lib/accounts"
import { confirmDestructive } from "@/lib/confirm"
import { accountSchema, type AccountFormValues } from "@/lib/schemas/account"
import { parseAmount } from "@/lib/schemas/amount"

/** Create form when `account` is omitted, edit form otherwise. */
export function useAccountForm(account?: Account) {
  const router = useRouter()
  const createAccount = useCreateAccount()
  const updateAccount = useUpdateAccount()
  const deleteAccount = useDeleteAccount()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema(!account)),
    defaultValues: account
      ? { name: account.name, type: account.type, currency: account.currency, balance: "" }
      : { name: "", type: "cash", currency: "USD", balance: "0" },
  })

  const onValid = async (values: AccountFormValues) => {
    setServerError(null)
    try {
      if (account) {
        // PATCH only what changed: the API schema has no defaults to reset.
        const input: UpdateAccountInput = {}
        if (values.name.trim() !== account.name) input.name = values.name.trim()
        if (values.type !== account.type) input.type = values.type
        if (values.currency !== account.currency) input.currency = values.currency
        if (Object.keys(input).length > 0) {
          await updateAccount.mutateAsync({ id: account.id, input })
        }
      } else {
        await createAccount.mutateAsync({
          name: values.name.trim(),
          type: values.type,
          currency: values.currency,
          balance: parseAmount(values.balance),
        })
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
      router.back()
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't save the account.")
    }
  }

  const remove = async () => {
    if (!account) return
    const ok = await confirmDestructive(
      "Delete account?",
      `"${account.name}" will be removed. This can't be undone.`
    )
    if (!ok) return
    setServerError(null)
    try {
      await deleteAccount.mutateAsync(account.id)
      router.back()
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't delete the account.")
    }
  }

  return {
    form,
    submit: () => form.handleSubmit(onValid)(),
    remove,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    isDeleting: deleteAccount.isPending,
  }
}
