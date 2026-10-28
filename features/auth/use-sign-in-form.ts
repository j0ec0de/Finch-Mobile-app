import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api"
import { signInSchema, type SignInValues } from "@/lib/schemas/auth"

export function useSignInForm() {
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  const onValid = async (values: SignInValues) => {
    setServerError(null)
    try {
      await login(values.email.trim().toLowerCase(), values.password)
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't sign in. Please try again.")
    }
  }
  const submit = () => form.handleSubmit(onValid)()

  return { form, submit, serverError, isSubmitting: form.formState.isSubmitting }
}
