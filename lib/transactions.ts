import { apiRequest } from "@/lib/api"

export const transactionTypes = ["expense", "income"] as const

export type TransactionType = (typeof transactionTypes)[number]

export type Transaction = {
  id: number
  userId: number
  accountId: number
  categoryId: number | null
  type: TransactionType
  amount: string
  description: string | null
  occurredAt: string
  createdAt: string
  transferGroupId: string | null
}

export type CreateTransactionInput = {
  accountId: number
  categoryId?: number
  type: TransactionType
  amount: number
  description?: string
  occurredAt?: string
}

export type UpdateTransactionInput = Partial<CreateTransactionInput>

export type ListTransactionsParams = {
  accountId?: number
  categoryId?: number
  type?: TransactionType
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export type ListTransactionsResult = {
  data: Transaction[]
  total: number
  limit: number
  offset: number
}

export type DateRangeParams = {
  startDate?: string
  endDate?: string
}

export type TransactionsSummary = {
  income: number
  expense: number
  net: number
}

export type CategoryTotal = {
  categoryId: number | null
  categoryName: string
  type: TransactionType
  total: number
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value))
  }
  const qs = query.toString()
  return qs ? `?${qs}` : ""
}

export const listTransactions = (
  token: string,
  params: ListTransactionsParams = {}
) => apiRequest<ListTransactionsResult>(`/transactions${buildQuery(params)}`, { token })

export const createTransaction = (token: string, input: CreateTransactionInput) =>
  apiRequest<Transaction>("/transactions", { method: "POST", body: input, token })

export const updateTransaction = (
  token: string,
  id: number,
  input: UpdateTransactionInput
) =>
  apiRequest<Transaction>(`/transactions/${id}`, {
    method: "PATCH",
    body: input,
    token,
  })

export const deleteTransaction = (token: string, id: number) =>
  apiRequest<null>(`/transactions/${id}`, { method: "DELETE", token })

export const getTransactionsSummary = (
  token: string,
  params: DateRangeParams = {}
) => apiRequest<TransactionsSummary>(`/transactions/summary${buildQuery(params)}`, { token })

export const getTransactionsByCategory = (
  token: string,
  params: DateRangeParams = {}
) =>
  apiRequest<{ data: CategoryTotal[] }>(
    `/transactions/by-category${buildQuery(params)}`,
    { token }
  )

// Mobile addition (not in the web client): the edit sheet loads one transaction by id.
export const getTransaction = (token: string, id: number) =>
  apiRequest<Transaction>(`/transactions/${id}`, { token })
