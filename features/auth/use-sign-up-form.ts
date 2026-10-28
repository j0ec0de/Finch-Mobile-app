import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useAuth } from "@/hooks/use-auth"
import { ApiError } from "@/lib/api"
import { signUpSchema, type SignUpValues } from "@/lib/schemas/auth"

export function useSignUpForm() {
  const { register } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onValid = async (values: SignUpValues) => {
    setServerError(null)
    try {
      await register(values.name.trim(), values.email.trim().toLowerCase(), values.password)
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : "Couldn't create your account. Please try again.")
    }
  }
  const submit = () => form.handleSubmit(onValid)()

  return { form, submit, serverError, isSubmitting: form.formState.isSubmitting }
}
