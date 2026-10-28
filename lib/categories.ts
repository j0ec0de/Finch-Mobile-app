import { apiRequest } from "@/lib/api"

export const categoryTypes = ["expense", "income"] as const

export type CategoryType = (typeof categoryTypes)[number]

export type Category = {
  id: number
  userId: number
  name: string
  type: CategoryType
  icon: string | null
  color: string | null
  createdAt: string
}

export type CreateCategoryInput = {
  name: string
  type: CategoryType
  icon?: string
  color?: string
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>

export const listCategories = (token: string) =>
  apiRequest<Category[]>("/categories", { token })

export const createCategory = (token: string, input: CreateCategoryInput) =>
  apiRequest<Category>("/categories", { method: "POST", body: input, token })

export const updateCategory = (
  token: string,
  id: number,
  input: UpdateCategoryInput
) =>
  apiRequest<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: input,
    token,
  })

export const deleteCategory = (token: string, id: number) =>
  apiRequest<null>(`/categories/${id}`, { method: "DELETE", token })
