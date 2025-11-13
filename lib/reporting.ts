"use server"

import { generateAIResponse } from "@/lib/ai"
import { supabase } from "@/lib/supabase"
import { format, subDays } from "date-fns"

export interface ReportData {
  type: "monthly_site" | "portfolio" | "campaign" | "technical" | "executive"
  siteIds: string[]
  periodStart: Date
  periodEnd: Date
  templateId?: string
  orgId?: string
}

export async function renderReport(data: ReportData): Promise<{ success: boolean; reportId?: string; html?: string; error?: string }> {
  try {
    const orgId = data.orgId || "demo-org-id"
    
    // Generate report content using AI
    const narrative = await generateAIResponse(
      `Generate a comprehensive ${data.type} report narrative covering:
    - Executive Summary with wins/losses and KPI deltas
    - Traffic analysis (sessions, users, conversions, revenue, channel mix)
    - SEO performance (rank changes, winners/losers, clusters, SOV)
    - Content performance (decay, opportunity, new content impact)
    - Backlinks (new/lost domains, anchors, authority)
    - CWV & Technical health (LCP/INP/CLS pass rates, regressions, crawl errors)
    - Ads performance (spend, clicks, conversions, ROAS, anomalies)
    - Attribution snapshot
    - Next-month plan with AI-ranked actions
    
    Period: ${format(data.periodStart, "yyyy-MM-dd")} to ${format(data.periodEnd, "yyyy-MM-dd")}
    Sites: ${data.siteIds.join(", ")}`
    )

    // Fetch actual data from database
    const { data: trafficData, error: trafficError } = await supabase
      .from("traffic_daily")
      .select("*")
      .in("site_id", data.siteIds)
      .gte("date", format(data.periodStart, "yyyy-MM-dd"))
      .lte("date", format(data.periodEnd, "yyyy-MM-dd"))
      .order("date", { ascending: true })

    const { data: ranksData, error: ranksError } = await supabase
      .from("ranks")
      .select("*, keywords(*), sites(*)")
      .in("site_id", data.siteIds)
      .gte("date", format(data.periodStart, "yyyy-MM-dd"))
      .lte("date", format(data.periodEnd, "yyyy-MM-dd"))

    const { data: backlinksData } = await supabase
      .from("backlinks")
      .select("*")
      .in("site_id", data.siteIds)
      .gte("first_seen", format(data.periodStart, "yyyy-MM-dd"))
      .lte("last_seen", format(data.periodEnd, "yyyy-MM-dd"))

    const { data: adsData } = await supabase
      .from("ads_stats")
      .select("*")
      .in("site_id", data.siteIds)
      .gte("date", format(data.periodStart, "yyyy-MM-dd"))
      .lte("date", format(data.periodEnd, "yyyy-MM-dd"))

    // Generate HTML report
    const html = generateReportHTML({
      type: data.type,
      narrative,
      trafficData: trafficData || [],
      ranksData: ranksData || [],
      backlinksData: backlinksData || [],
      adsData: adsData || [],
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
    })

    // Store report in database
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        org_id: orgId,
        type: data.type,
        period_start: format(data.periodStart, "yyyy-MM-dd"),
        period_end: format(data.periodEnd, "yyyy-MM-dd"),
        site_scope: { site_ids: data.siteIds },
        template_id: data.templateId,
        status: "completed",
        url: `/api/reports/${Date.now()}.html`,
      })
      .select()
      .single()

    if (reportError) {
      console.error("Report save error:", reportError)
      // Still return HTML even if save fails
      return { success: true, html }
    }

    return { success: true, reportId: report.id, html }
  } catch (error) {
    console.error("Report generation error:", error)
    return { success: false, error: String(error) }
  }
}

function generateReportHTML({
  type,
  narrative,
  trafficData,
  ranksData,
  backlinksData,
  adsData,
  periodStart,
  periodEnd,
}: {
  type: string
  narrative: string
  trafficData: any[]
  ranksData: any[]
  backlinksData: any[]
  adsData: any[]
  periodStart: Date
  periodEnd: Date
}): string {
  const totalSessions = trafficData.reduce((sum, d) => sum + (d.sessions || 0), 0)
  const totalUsers = trafficData.reduce((sum, d) => sum + (d.users || 0), 0)
  const totalConversions = trafficData.reduce((sum, d) => sum + (d.conversions || 0), 0)
  const totalRevenue = trafficData.reduce((sum, d) => sum + parseFloat(d.revenue || 0), 0)
  
  const channelBreakdown = trafficData.reduce((acc: Record<string, { sessions: number; revenue: number }>, d) => {
    const channel = d.channel_group || "Unknown"
    if (!acc[channel]) {
      acc[channel] = { sessions: 0, revenue: 0 }
    }
    acc[channel].sessions += d.sessions || 0
    acc[channel].revenue += parseFloat(d.revenue || 0)
    return acc
  }, {})

  const newBacklinks = backlinksData.filter(b => {
    const firstSeen = new Date(b.first_seen)
    return firstSeen >= periodStart && firstSeen <= periodEnd
  }).length

  const totalAdSpend = adsData.reduce((sum, d) => sum + parseFloat(d.cost || 0), 0)
  const totalAdRevenue = adsData.reduce((sum, d) => sum + parseFloat(d.revenue || 0), 0)
  const roas = totalAdSpend > 0 ? (totalAdRevenue / totalAdSpend).toFixed(2) : "0.00"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${type.replace("_", " ").toUpperCase()} Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
      max-width: 1200px; 
      margin: 0 auto; 
      padding: 40px 20px;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
    }
    .header {
      border-bottom: 4px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    h1 { 
      color: #1a1a1a; 
      font-size: 2.5rem;
      margin-bottom: 10px;
    }
    h2 { 
      color: #333; 
      margin-top: 40px; 
      margin-bottom: 20px;
      font-size: 1.8rem;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    h3 {
      color: #555;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.3rem;
    }
    .summary { 
      background: #f3f4f6; 
      padding: 25px; 
      border-radius: 8px; 
      margin: 20px 0;
      border-left: 4px solid #3b82f6;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .metric-card {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .metric-value { 
      font-size: 2rem; 
      font-weight: bold; 
      color: #3b82f6;
      margin: 10px 0;
    }
    .metric-label { 
      font-size: 0.9rem; 
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-change {
      font-size: 0.85rem;
      color: #059669;
      margin-top: 5px;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
      background: white;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th, td { 
      padding: 12px 15px; 
      text-align: left; 
      border-bottom: 1px solid #e5e7eb; 
    }
    th { 
      background: #f9fafb; 
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }
    tr:hover {
      background: #f9fafb;
    }
    .narrative {
      background: white;
      padding: 25px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #e5e7eb;
    }
    .narrative p {
      margin-bottom: 15px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }
    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }
    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${type.replace("_", " ").toUpperCase()} Report</h1>
    <div class="summary">
      <p><strong>Period:</strong> ${format(periodStart, "MMMM d, yyyy")} - ${format(periodEnd, "MMMM d, yyyy")}</p>
      <p><strong>Generated:</strong> ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
      <p><strong>Report Type:</strong> ${type.replace("_", " ")}</p>
    </div>
  </div>
  
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Total Sessions</div>
      <div class="metric-value">${totalSessions.toLocaleString()}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Total Users</div>
      <div class="metric-value">${totalUsers.toLocaleString()}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Conversions</div>
      <div class="metric-value">${totalConversions.toLocaleString()}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Revenue</div>
      <div class="metric-value">$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    </div>
  </div>
  
  <h2>Executive Summary</h2>
  <div class="narrative">
    ${narrative.split("\n").map((p) => p.trim() ? `<p>${p}</p>` : "").join("")}
  </div>
  
  <h2>Traffic Overview</h2>
  ${trafficData.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Sessions</th>
          <th>Users</th>
          <th>Conversions</th>
          <th>Revenue</th>
          <th>Channel</th>
        </tr>
      </thead>
      <tbody>
        ${trafficData.slice(0, 30).map((row) => `
          <tr>
            <td>${format(new Date(row.date), "MMM d, yyyy")}</td>
            <td>${row.sessions?.toLocaleString() || 0}</td>
            <td>${row.users?.toLocaleString() || 0}</td>
            <td>${row.conversions || 0}</td>
            <td>$${parseFloat(row.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td>${row.channel_group || "Unknown"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "<p>No traffic data available for this period.</p>"}
  
  <h2>Channel Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Channel</th>
        <th>Sessions</th>
        <th>Revenue</th>
        <th>% of Total</th>
      </tr>
    </thead>
    <tbody>
      ${Object.entries(channelBreakdown).map(([channel, data]) => `
        <tr>
          <td>${channel}</td>
          <td>${data.sessions.toLocaleString()}</td>
          <td>$${data.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          <td>${totalSessions > 0 ? ((data.sessions / totalSessions) * 100).toFixed(1) : 0}%</td>
        </tr>
      `).join("")}
    </tbody>
  </table>
  
  <h2>SEO Performance</h2>
  <p>Ranking data for <strong>${ranksData.length}</strong> keyword-site combinations tracked.</p>
  ${ranksData.length > 0 ? `
    <table>
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Position</th>
          <th>URL</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${ranksData.slice(0, 20).map((rank: any) => `
          <tr>
            <td>${rank.keywords?.phrase || "N/A"}</td>
            <td>#${rank.position || "N/A"}</td>
            <td>${rank.url || "N/A"}</td>
            <td>${format(new Date(rank.date), "MMM d, yyyy")}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : "<p>No ranking data available for this period.</p>"}
  
  <h2>Backlinks</h2>
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">New Backlinks</div>
      <div class="metric-value">+${newBacklinks}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Total Backlinks</div>
      <div class="metric-value">${backlinksData.length}</div>
    </div>
  </div>
  
  ${adsData.length > 0 ? `
    <h2>Ads Performance</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Spend</div>
        <div class="metric-value">$${totalAdSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Revenue</div>
        <div class="metric-value">$${totalAdRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">ROAS</div>
        <div class="metric-value">${roas}x</div>
      </div>
    </div>
  ` : ""}
  
  <div class="footer">
    <p>Generated by <strong>1shotSEO</strong> - AI-First Website Intelligence Platform</p>
    <p>This report contains confidential information and is intended for authorized recipients only.</p>
  </div>
</body>
</html>
  `
}

export async function sendReport(
  reportId: string,
  recipients: string[],
  channel: "email" | "slack" | "notion",
  message?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Store delivery record
    const { error } = await supabase.from("deliveries").insert({
      report_id: reportId,
      channel,
      recipients: { emails: recipients },
      status: "sent",
      sent_at: new Date().toISOString(),
      metadata: { message },
    })

    if (error) {
      console.error("Delivery record error:", error)
      return { success: false, error: error.message }
    }

    // In production, integrate with actual email/Slack/Notion APIs
    console.log(`Report ${reportId} sent to ${recipients.join(", ")} via ${channel}`)
    if (message) {
      console.log(`Message: ${message}`)
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
