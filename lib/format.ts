const formatters = new Map<string, Intl.NumberFormat>()

function getFormatter(currency: string) {
  let formatter = formatters.get(currency)
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    })
    formatters.set(currency, formatter)
  }
  return formatter
}

export function formatCurrency(value: number, currency = "USD") {
  return getFormatter(currency).format(value)
}

export function calcDeltaPct(current: number, previous: number) {
  if (previous === 0) return 0
  return ((current - previous) / Math.abs(previous)) * 100
}
