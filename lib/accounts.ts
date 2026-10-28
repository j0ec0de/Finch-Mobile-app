import { apiRequest } from "@/lib/api"

export const accountTypes = [
  "cash",
  "bank",
  "credit_card",
  "wallet",
  "investment",
  "other",
] as const

export type AccountType = (typeof accountTypes)[number]

export const currencies = [
  { code: "USD", label: "US Dollar" },
  { code: "INR", label: "Indian Rupee" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "SGD", label: "Singapore Dollar" },
] as const

export type Account = {
  id: number
  name: string
  type: AccountType
  balance: string
  currency: string
  userId: number
  createdAt: string
}

export type CreateAccountInput = {
  name: string
  type: AccountType
  balance: number
  currency: string
}

export type UpdateAccountInput = Partial<Omit<CreateAccountInput, "balance">>

export const listAccounts = (token: string) =>
  apiRequest<Account[]>("/accounts", { token })

export const createAccount = (token: string, input: CreateAccountInput) =>
  apiRequest<Account>("/accounts", { method: "POST", body: input, token })

export const updateAccount = (
  token: string,
  id: number,
  input: UpdateAccountInput
) =>
  apiRequest<Account>(`/accounts/${id}`, { method: "PATCH", body: input, token })

export const deleteAccount = (token: string, id: number) =>
  apiRequest<null>(`/accounts/${id}`, { method: "DELETE", token })
