import { toast } from "sonner-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/hooks/use-auth"
import * as budgetsApi from "@/lib/budgets"
import type { CreateBudgetInput, UpdateBudgetInput } from "@/lib/budgets"

export const budgetsKey = ["budgets"] as const

export function useBudgets() {
  const { token } = useAuth()

  return useQuery({
    queryKey: budgetsKey,
    queryFn: () => budgetsApi.listBudgets(token!),
    enabled: !!token,
  })
}

export function useCreateBudget() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBudgetInput) =>
      budgetsApi.createBudget(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKey })
      toast.success("Budget created")
    },
  })
}

export function useUpdateBudget() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBudgetInput }) =>
      budgetsApi.updateBudget(token!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKey })
      toast.success("Budget updated")
    },
  })
}

export function useDeleteBudget() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => budgetsApi.deleteBudget(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetsKey })
      toast.success("Budget deleted")
    },
  })
}
