import { toast } from "sonner-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/hooks/use-auth"
import * as goalsApi from "@/lib/goals"
import type { CreateGoalInput, UpdateGoalInput } from "@/lib/goals"

export const goalsKey = ["goals"] as const

export function useGoals() {
  const { token } = useAuth()

  return useQuery({
    queryKey: goalsKey,
    queryFn: () => goalsApi.listGoals(token!),
    enabled: !!token,
  })
}

export function useCreateGoal() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateGoalInput) => goalsApi.createGoal(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey })
      toast.success("Goal created")
    },
  })
}

export function useUpdateGoal() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateGoalInput }) =>
      goalsApi.updateGoal(token!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey })
      toast.success("Goal updated")
    },
  })
}

export function useDeleteGoal() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => goalsApi.deleteGoal(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalsKey })
      toast.success("Goal deleted")
    },
  })
}
