import { zodResolver } from "@hookform/resolvers/zod"
import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from "@/hooks/use-transactions"
import { ApiError } from "@/lib/api"
import { confirmDestructive } from "@/lib/confirm"
import { parseAmount } from "@/lib/schemas/amount"
import { transactionSchema, type TransactionFormValues } from "@/lib/schemas/transaction"
import type { Transaction, UpdateTransactionInput } from "@/lib/transactions"

/** Create form when `transaction` is omitted, edit form otherwise. */
export function useTransactionForm(transaction?: Transaction, defaultAccountId?: number) {
  const router = useRouter()
  const createTransaction = useCreateTransaction()
  const updateTransaction = useUpdateTransaction()
  const deleteTransaction = useDeleteTransaction()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          amount: String(Number(transaction.amount)),
          accountId: transaction.accountId,
          categoryId: transaction.categoryId,
          description: transaction.description ?? "",
          occurredAt: new Date(transaction.occurredAt),
        }
      : {
          type: "expense",
          amount: "",
          accountId: defaultAccountId ?? null,
          categoryId: null,
          description: "",
          occurredAt: new Date(),
        },
  })

  const onValid = async (values: TransactionFormValues) => {
    setServerError(null)
    const accountId = values.accountId as number
    const amount = parseAmount(values.amount)
    const description = values.description.trim()
    try {
      if (transaction) {
        // PATCH only what changed.
        const input: UpdateTransactionInput = {}
        if (values.type !== transaction.type) input.type = values.type
        if (amount !== Number(transaction.amount)) input.amount = amount
        if (accountId !== transaction.accountId) input.accountId = accountId
        if (values.categoryId !== null && values.categoryId !== transaction.categoryId) {
          input.categoryId = values.categoryId
        }
        if (description !== (transaction.description ?? "") && description !== "") {
          input.description = description
        }
        if (values.occurredAt.toISOString() !== new Date(transaction.occurredAt).toISOString()) {
          input.occurredAt = values.occurredAt.toISOString()
        }
        if (Object.keys(input).length > 0) {
          await updateTransaction.mutateAsync({ id: transaction.id, input })
        }
      } else {
        await createTransaction.mutateAsync({
          accountId,
          type: values.type,
          amount,
          occurredAt: values.occurredAt.toISOString(),
          ...(values.categoryId !== null ? { categoryId: values.categoryId } : {}),
          ...(description !== "" ? { description } : {}),
        })
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
      router.back()
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't save the transaction.")
    }
  }

  const remove = async () => {
    if (!transaction) return
    const isTransfer = transaction.transferGroupId !== null
    const ok = await confirmDestructive(
      isTransfer ? "Delete transfer?" : "Delete transaction?",
      isTransfer
        ? "Both sides of this transfer will be removed. This can't be undone."
        : "This can't be undone."
    )
    if (!ok) return
    setServerError(null)
    try {
      await deleteTransaction.mutateAsync(transaction.id)
      router.back()
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't delete the transaction.")
    }
  }

  return {
    form,
    submit: () => form.handleSubmit(onValid)(),
    remove,
    serverError,
    isSubmitting: form.formState.isSubmitting,
    isDeleting: deleteTransaction.isPending,
  }
}
