import * as SecureStore from "expo-secure-store"
import { useQueryClient } from "@tanstack/react-query"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { setUnauthorizedHandler } from "@/lib/api"
import * as authApi from "@/lib/auth"
import type { AuthUser } from "@/lib/auth"

const TOKEN_STORAGE_KEY = "finch.token"

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  // The token is read from SecureStore asynchronously, so the session is
  // loading until that read (and the /auth/me check) finish.
  const [isRestoring, setIsRestoring] = useState(true)
  const [isLoadingUser, setIsLoadingUser] = useState(false)

  const clearSession = useCallback(() => {
    SecureStore.deleteItemAsync(TOKEN_STORAGE_KEY).catch(() => {})
    setToken(null)
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          setIsLoadingUser(true)
          setToken(stored)
        }
      })
      .catch(() => {})
      .finally(() => setIsRestoring(false))
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  useEffect(() => {
    if (!token || user) return

    authApi
      .getMe(token)
      .then(setUser)
      .catch(clearSession)
      .finally(() => setIsLoadingUser(false))
  }, [token, user, clearSession])

  const applySession = useCallback(
    async (session: { user: AuthUser; token: string }) => {
      await SecureStore.setItemAsync(TOKEN_STORAGE_KEY, session.token)
      setToken(session.token)
      setUser(session.user)
    },
    []
  )

  const login = useCallback(
    async (email: string, password: string) => {
      await applySession(await authApi.login(email, password))
    },
    [applySession]
  )

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await applySession(await authApi.register(name, email, password))
    },
    [applySession]
  )

  const isLoading = isRestoring || isLoadingUser

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout: clearSession }),
    [user, token, isLoading, login, register, clearSession]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
