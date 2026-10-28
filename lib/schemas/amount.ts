import { z } from "zod"

/** Parses what the user typed into a number. Accepts a decimal comma. */
export function parseAmount(value: string) {
  return Number(value.trim().replace(",", "."))
}

export const positiveAmount = z
  .string()
  .trim()
  .refine((v) => v !== "" && Number.isFinite(parseAmount(v)) && parseAmount(v) > 0, {
    message: "Enter an amount greater than 0",
  })

export const finiteAmount = z
  .string()
  .trim()
  .refine((v) => v !== "" && Number.isFinite(parseAmount(v)), {
    message: "Enter a valid amount",
  })
