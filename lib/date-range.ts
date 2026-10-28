export function getMonthRange(monthsAgo = 0) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1)
  return { startDate: start.toISOString(), endDate: end.toISOString() }
}

export function getLastNDaysRange(days: number) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(start.getDate() - (days - 1))
  start.setHours(0, 0, 0, 0)
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return { startDate: start.toISOString(), endDate: end.toISOString() }
}

// A window of `months` whole months ending now, optionally shifted `monthsAgo`
// months into the past (used to fetch the prior equal-length window for deltas).
export function getLastNMonthsRange(months: number, monthsAgo = 0) {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 1)
  const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo - months + 1, 1)
  return { startDate: start.toISOString(), endDate: end.toISOString() }
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export function getMonthLabel(monthsAgo = 0) {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  return MONTH_LABELS[date.getMonth()]
}
