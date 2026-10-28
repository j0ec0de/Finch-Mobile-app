import { z } from "zod"

import { accountTypes } from "@/lib/accounts"
import { parseAmount } from "@/lib/schemas/amount"

// Mirrors backend/src/modules/accounts/accounts.schema.ts. The starting balance
// is only editable on create (the API ignores it on PATCH), so it is only
// validated when `requireBalance` is set.
export const accountSchema = (requireBalance: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, "Enter a name"),
      type: z.enum(accountTypes),
      currency: z.string().length(3, "Choose a currency"),
      balance: z.string(),
    })
    .superRefine((value, ctx) => {
      const n = parseAmount(value.balance)
      if (requireBalance && (value.balance.trim() === "" || !Number.isFinite(n))) {
        ctx.addIssue({ code: "custom", path: ["balance"], message: "Enter a valid amount" })
      }
    })

export type AccountFormValues = z.input<ReturnType<typeof accountSchema>>
