import { z } from "zod"

// Mirrors backend/src/modules/auth/auth.schema.ts
const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"))

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
  email,
  password: z.string().min(8, "Use at least 8 characters"),
})

export type SignInValues = z.input<typeof signInSchema>
export type SignUpValues = z.input<typeof signUpSchema>
