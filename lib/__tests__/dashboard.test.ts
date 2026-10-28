import { buildDailyFlow, percentSaved } from "@/lib/dashboard"
import { calcDeltaPct, formatCurrency } from "@/lib/format"

describe("buildDailyFlow", () => {
  const now = new Date(2026, 9, 28, 12) // Wed 28 Oct 2026

  it("returns one bucket per day, oldest first, labelled by weekday for a week", () => {
    const days = buildDailyFlow([], 7, now)
    expect(days).toHaveLength(7)
    expect(days[0].day).toBe("Thu")
    expect(days[6].day).toBe("Wed")
  })

  it("buckets income and expenses and ignores transfer legs", () => {
    const days = buildDailyFlow(
      [
        { type: "income", amount: "100.50", occurredAt: new Date(2026, 9, 28, 9).toISOString(), transferGroupId: null },
        { type: "expense", amount: "40", occurredAt: new Date(2026, 9, 28, 18).toISOString(), transferGroupId: null },
        { type: "expense", amount: "999", occurredAt: new Date(2026, 9, 28, 18).toISOString(), transferGroupId: "abc" },
        { type: "expense", amount: "5", occurredAt: new Date(2026, 8, 1).toISOString(), transferGroupId: null },
      ],
      7,
      now
    )
    const today = days[6]
    expect(today.income).toBe(100.5)
    expect(today.expenses).toBe(40)
    expect(days.reduce((s, d) => s + d.expenses, 0)).toBe(40)
  })

  it("labels longer ranges as day/month", () => {
    expect(buildDailyFlow([], 30, now)[29].day).toBe("28/10")
  })
})

describe("percentSaved", () => {
  it("is 0 when there is no income", () => {
    expect(percentSaved(-50, 0)).toBe(0)
  })
  it("rounds and clamps", () => {
    expect(percentSaved(250, 1000)).toBe(25)
    expect(percentSaved(-200, 1000)).toBe(0)
    expect(percentSaved(1500, 1000)).toBe(100)
  })
})

describe("format helpers", () => {
  it("calcDeltaPct handles a zero baseline", () => {
    expect(calcDeltaPct(50, 0)).toBe(0)
    expect(calcDeltaPct(150, 100)).toBe(50)
  })
  it("formatCurrency formats whole units", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,235")
  })
})
