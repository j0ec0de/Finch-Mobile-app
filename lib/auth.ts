import { apiRequest } from "@/lib/api"

export type AuthUser = {
  id: number
  name: string
  email: string
  createdAt: string
}

export type AuthResponse = {
  user: AuthUser
  token: string
}

export const login = (email: string, password: string) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  })

export const register = (name: string, email: string, password: string) =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  })

export const getMe = (token: string) =>
  apiRequest<AuthUser>("/auth/me", { token })
