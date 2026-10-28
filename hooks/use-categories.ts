import { toast } from "sonner-native"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useAuth } from "@/hooks/use-auth"
import * as categoriesApi from "@/lib/categories"
import type { CreateCategoryInput, UpdateCategoryInput } from "@/lib/categories"

export const categoriesKey = ["categories"] as const

export function useCategories() {
  const { token } = useAuth()

  return useQuery({
    queryKey: categoriesKey,
    queryFn: () => categoriesApi.listCategories(token!),
    enabled: !!token,
  })
}

export function useCreateCategory() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      categoriesApi.createCategory(token!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey })
      toast.success("Category created")
    },
  })
}

export function useUpdateCategory() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCategoryInput }) =>
      categoriesApi.updateCategory(token!, id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey })
      toast.success("Category updated")
    },
  })
}

export function useDeleteCategory() {
  const { token } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKey })
      toast.success("Category deleted")
    },
  })
}
