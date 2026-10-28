import { accountSchema } from "@/lib/schemas/account"
import { parseAmount } from "@/lib/schemas/amount"
import { signInSchema, signUpSchema } from "@/lib/schemas/auth"
import { transactionSchema } from "@/lib/schemas/transaction"

describe("parseAmount", () => {
  it("accepts a decimal comma", () => {
    expect(parseAmount("12,50")).toBe(12.5)
  })
})

describe("auth schemas", () => {
  it("requires a valid email and a password of 8+ characters to sign up", () => {
    expect(signUpSchema.safeParse({ name: "A", email: "nope", password: "12345678" }).success).toBe(false)
    expect(signUpSchema.safeParse({ name: "A", email: "a@b.co", password: "1234567" }).success).toBe(false)
    expect(signUpSchema.safeParse({ name: "A", email: "a@b.co", password: "12345678" }).success).toBe(true)
  })
  it("normalises the email on sign in", () => {
    const r = signInSchema.parse({ email: "  A@B.CO ", password: "x" })
    expect(r.email).toBe("a@b.co")
  })
})

describe("accountSchema", () => {
  const base = { name: "Main", type: "bank", currency: "USD" } as const
  it("validates the starting balance only on create", () => {
    expect(accountSchema(true).safeParse({ ...base, balance: "" }).success).toBe(false)
    expect(accountSchema(true).safeParse({ ...base, balance: "-20.5" }).success).toBe(true)
    expect(accountSchema(false).safeParse({ ...base, balance: "" }).success).toBe(true)
  })
  it("rejects a blank name and a bad currency", () => {
    expect(accountSchema(false).safeParse({ ...base, name: "  ", balance: "" }).success).toBe(false)
    expect(accountSchema(false).safeParse({ ...base, currency: "US", balance: "" }).success).toBe(false)
  })
})

describe("transactionSchema", () => {
  const base = {
    type: "expense",
    amount: "10",
    accountId: 1,
    categoryId: null,
    description: "",
    occurredAt: new Date(),
  } as const
  it("requires a positive amount and an account", () => {
    expect(transactionSchema.safeParse(base).success).toBe(true)
    expect(transactionSchema.safeParse({ ...base, amount: "0" }).success).toBe(false)
    expect(transactionSchema.safeParse({ ...base, amount: "abc" }).success).toBe(false)
    expect(transactionSchema.safeParse({ ...base, accountId: null }).success).toBe(false)
  })
})
