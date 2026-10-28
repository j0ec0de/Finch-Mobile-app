import { apiRequest } from "@/lib/api"

export type Goal = {
  id: number
  userId: number
  name: string
  targetAmount: string
  savedAmount: string
  targetDate: string | null
  createdAt: string
}

export type CreateGoalInput = {
  name: string
  targetAmount: number
  savedAmount?: number
  targetDate?: string | null
}

export type UpdateGoalInput = Partial<CreateGoalInput>

export const listGoals = (token: string) => apiRequest<Goal[]>("/goals", { token })

export const createGoal = (token: string, input: CreateGoalInput) =>
  apiRequest<Goal>("/goals", { method: "POST", body: input, token })

export const updateGoal = (token: string, id: number, input: UpdateGoalInput) =>
  apiRequest<Goal>(`/goals/${id}`, { method: "PATCH", body: input, token })

export const deleteGoal = (token: string, id: number) =>
  apiRequest<null>(`/goals/${id}`, { method: "DELETE", token })
