import { apiRequest } from "@/lib/api"
import type { Transaction } from "@/lib/transactions"

export type CreateTransferInput = {
  fromAccountId: number
  toAccountId: number
  amount: number
  description?: string
  occurredAt?: string
}

export type TransferResult = {
  outgoing: Transaction
  incoming: Transaction
}

export const createTransfer = (token: string, input: CreateTransferInput) =>
  apiRequest<TransferResult>("/transfers", { method: "POST", body: input, token })
