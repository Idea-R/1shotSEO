"use server"

import { renderReport, sendReport } from "@/lib/reporting"
import { subDays, startOfMonth, endOfMonth } from "date-fns"

export async function createMonthlyReport(siteIds: string[], orgId?: string) {
  const now = new Date()
  const periodStart = startOfMonth(subDays(now, 30))
  const periodEnd = endOfMonth(subDays(now, 1))

  return await renderReport({
    type: "monthly_site",
    siteIds,
    periodStart,
    periodEnd,
    orgId,
  })
}

export async function createPortfolioReport(siteIds: string[], orgId?: string) {
  const now = new Date()
  const periodStart = startOfMonth(subDays(now, 30))
  const periodEnd = endOfMonth(subDays(now, 1))

  return await renderReport({
    type: "portfolio",
    siteIds,
    periodStart,
    periodEnd,
    orgId,
  })
}

export async function createExecutiveReport(siteIds: string[], orgId?: string) {
  const now = new Date()
  const periodStart = startOfMonth(subDays(now, 30))
  const periodEnd = endOfMonth(subDays(now, 1))

  return await renderReport({
    type: "executive",
    siteIds,
    periodStart,
    periodEnd,
    orgId,
  })
}

export async function sendReportAction(
  reportId: string,
  recipients: string[],
  channel: "email" | "slack" | "notion",
  message?: string
) {
  return await sendReport(reportId, recipients, channel, message)
}
