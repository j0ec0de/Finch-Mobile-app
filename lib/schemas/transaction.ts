import { z } from "zod"

import { transactionTypes } from "@/lib/transactions"
import { positiveAmount } from "@/lib/schemas/amount"

// Mirrors backend/src/modules/transactions/transactions.schema.ts
export const transactionSchema = z.object({
  type: z.enum(transactionTypes),
  amount: positiveAmount,
  accountId: z.number().nullable().refine((v) => v !== null, "Choose an account"),
  categoryId: z.number().nullable(),
  description: z.string().trim(),
  occurredAt: z.date(),
})

export type TransactionFormValues = z.input<typeof transactionSchema>
