import { renderReport, sendReport } from "@/lib/reporting"

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === "render") {
    const type = args[1] || "monthly_site"
    const siteIds = args[2]?.split(",") || ["site-1"]
    const periodStart = new Date(args[3] || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    const periodEnd = new Date(args[4] || new Date())

    console.log(`Rendering ${type} report...`)
    const html = await renderReport({
      type: type as any,
      siteIds,
      periodStart,
      periodEnd,
    })

    console.log("Report rendered successfully!")
    console.log("HTML length:", html.length)
  } else if (command === "send") {
    const reportId = args[1]
    const recipients = args[2]?.split(",") || ["demo@example.com"]
    const channel = (args[3] || "email") as "email" | "slack" | "notion"

    console.log(`Sending report ${reportId} to ${recipients.join(", ")} via ${channel}...`)
    await sendReport(reportId, recipients, channel)
    console.log("Report sent successfully!")
  } else {
    console.log("Usage:")
    console.log("  npm run report:render [type] [siteIds] [startDate] [endDate]")
    console.log("  npm run report:send [reportId] [recipients] [channel]")
  }
}

main().catch(console.error)

