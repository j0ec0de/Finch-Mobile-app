import { apiRequest } from "@/lib/api"

export const budgetPeriods = ["weekly", "monthly"] as const

export type BudgetPeriod = (typeof budgetPeriods)[number]

export type Budget = {
  id: number
  userId: number
  categoryId: number
  limit: string
  period: BudgetPeriod
  createdAt: string
  spent: number
  remaining: number
}

export type CreateBudgetInput = {
  categoryId: number
  limit: number
  period: BudgetPeriod
}

export type UpdateBudgetInput = Partial<CreateBudgetInput>

export const listBudgets = (token: string) =>
  apiRequest<Budget[]>("/budgets", { token })

export const createBudget = (token: string, input: CreateBudgetInput) =>
  apiRequest<Budget>("/budgets", { method: "POST", body: input, token })

export const updateBudget = (
  token: string,
  id: number,
  input: UpdateBudgetInput
) =>
  apiRequest<Budget>(`/budgets/${id}`, { method: "PATCH", body: input, token })

export const deleteBudget = (token: string, id: number) =>
  apiRequest<null>(`/budgets/${id}`, { method: "DELETE", token })
