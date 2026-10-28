import { toast } from "sonner-native"
import {
  useInfiniteQuery,
  useMutation,
  keepPreviousData,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

import { accountsKey } from "@/hooks/use-accounts"
import { useAuth } from "@/hooks/use-auth"
import { getMonthLabel, getMonthRange } from "@/lib/date-range"
import * as transactionsApi from "@/lib/transactions"
import type {
  CreateTransactionInput,
  DateRangeParams,
  ListTransactionsParams,
  UpdateTransactionInput,
} from "@/lib/transactions"

const transactionsKey = (params: ListTransactionsParams) =>
  ["transactions", params] as const

export function useTransactions(params: ListTransactionsParams) {
  const { token } = useAuth()

  return useQuery({
    queryKey: transactionsKey(params),
    queryFn: () => transactionsApi.listTransactions(token!, params),
    enabled: !!token,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useTransactionsSummary(params: DateRangeParams = {}) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["transactions", "summary", params] as const,
    queryFn: () => transactionsApi.getTransactionsSummary(token!, params),
    enabled: !!token,
  })
}

export function useTransactionsByCategory(params: DateRangeParams = {}) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["transactions", "by-category", params] as const,
    queryFn: () => transactionsApi.getTransactionsByCategory(token!, params),
    enabled: !!token,
  })
}

export function useTransactionsTrend(months: number) {
  const { token } = useAuth()
  const offsets = Array.from({ length: months }, (_, i) => months - 1 - i)
  const ranges = offsets.map((offset) => getMonthRange(offset))

  const results = useQueries({
    queries: ranges.map((range) => ({
      queryKey: ["transactions", "summary", range] as const,
      queryFn: () => transactionsApi.getTransactionsSummary(token!, range),
      enabled: !!token,
    })),
  })

  return {
    data: offsets.map((offset, i) => ({
      month: getMonthLabel(offset),
      income: results[i].data?.income ?? 0,
      expense: results[i].data?.expense ?? 0,
    })),
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    error: results.find((r) => r.isError)?.error,
  }
}

function useInvalidateOnMutate() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ["transactions"] })
    queryClient.invalidateQueries({ queryKey: accountsKey })
  }
}

export function useCreateTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionsApi.createTransaction(token!, input),
    onSuccess: () => {
      invalidate()
      toast.success("Transaction created")
    },
  })
}

export function useUpdateTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTransactionInput }) =>
      transactionsApi.updateTransaction(token!, id, input),
    onSuccess: () => {
      invalidate()
      toast.success("Transaction updated")
    },
  })
}

export function useDeleteTransaction() {
  const { token } = useAuth()
  const invalidate = useInvalidateOnMutate()

  return useMutation({
    mutationFn: (id: number) => transactionsApi.deleteTransaction(token!, id),
    onSuccess: () => {
      invalidate()
      toast.success("Transaction deleted")
    },
  })
}

// Mobile additions (not in the web client).

export const TRANSACTIONS_PAGE_SIZE = 30

/** Infinite list over the API's limit/offset pagination. */
export function useInfiniteTransactions(
  filters: Omit<ListTransactionsParams, "limit" | "offset">
) {
  const { token } = useAuth()

  return useInfiniteQuery({
    queryKey: ["transactions", "infinite", filters] as const,
    queryFn: ({ pageParam }) =>
      transactionsApi.listTransactions(token!, {
        ...filters,
        limit: TRANSACTIONS_PAGE_SIZE,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.offset + last.limit < last.total ? last.offset + last.limit : undefined,
    enabled: !!token,
    staleTime: 60_000,
  })
}

export function useTransaction(id: number) {
  const { token } = useAuth()

  return useQuery({
    queryKey: ["transactions", "detail", id] as const,
    queryFn: () => transactionsApi.getTransaction(token!, id),
    enabled: !!token && Number.isFinite(id),
  })
}
