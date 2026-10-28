import { toast } from "sonner-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/hooks/use-auth"
import * as accountsApi from "@/lib/accounts"
import type { CreateAccountInput, UpdateAccountInput } from "@/lib/accounts"

export const accountsKey = ["accounts"] as const

export function useAccounts() {
  const { token } = useAuth()

  return useQuery({
    queryKey: accountsKey,
    queryFn: () => accountsApi.listAccounts(token!),
    enabled: !!token,
  })
}

export function useCreateAccount() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAccountInput) =>
      accountsApi.createAccount(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKey })
      toast.success("Account created")
    },
  })
}

export function useUpdateAccount() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateAccountInput }) =>
      accountsApi.updateAccount(token!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKey })
      toast.success("Account updated")
    },
  })
}

export function useDeleteAccount() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => accountsApi.deleteAccount(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountsKey })
      toast.success("Account deleted")
    },
  })
}
