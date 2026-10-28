import { toast } from "sonner-native"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { accountsKey } from "@/hooks/use-accounts"
import { useAuth } from "@/hooks/use-auth"
import * as transfersApi from "@/lib/transfers"
import type { CreateTransferInput } from "@/lib/transfers"

export function useCreateTransfer() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransferInput) => transfersApi.createTransfer(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: accountsKey })
      toast.success("Transfer created")
    },
  })
}
