import { AppLayout } from "@/components/app-layout"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your website performance and insights
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Sessions"
            value="12,345"
            change="+12.5%"
            trend="up"
            href="/acquisition"
          />
          <KPICard
            title="Users"
            value="9,876"
            change="+8.3%"
            trend="up"
            href="/acquisition"
          />
          <KPICard
            title="Conversions"
            value="234"
            change="+15.2%"
            trend="up"
            href="/acquisition"
          />
          <KPICard
            title="Revenue"
            value="$45,678"
            change="+22.1%"
            trend="up"
            href="/acquisition"
          />
        </div>

        {/* Channel Mix Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChannelChart />
          <TopPages />
        </div>

        {/* Insights Stream */}
        <InsightsStream />
      </div>
    </AppLayout>
  )
}

function KPICard({
  title,
  value,
  change,
  trend,
  href,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  href: string
}) {
  return (
    <a href={href} className="block">
      <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        <div className={`mt-2 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change} vs last period
        </div>
      </div>
    </a>
  )
}

function ChannelChart() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Channel Mix</h2>
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        Chart placeholder - Channel breakdown
      </div>
    </div>
  )
}

function TopPages() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
      <div className="space-y-3">
        {[
          { url: "/blog/seo-guide", sessions: 1234 },
          { url: "/products", sessions: 987 },
          { url: "/about", sessions: 654 },
        ].map((page) => (
          <div key={page.url} className="flex justify-between items-center">
            <span className="text-sm">{page.url}</span>
            <span className="text-sm font-medium">{page.sessions.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InsightsStream() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
      <div className="space-y-4">
        <InsightCard
          title="Organic traffic increased 12%"
          description="Mainly driven by improved rankings for 'SEO tools' keyword cluster"
          impact="High"
          actions={["View keywords", "Create task"]}
        />
        <InsightCard
          title="CWV regression detected"
          description="LCP increased by 200ms on /products page"
          impact="Medium"
          actions={["View page", "Create task"]}
        />
      </div>
    </div>
  )
}

function InsightCard({
  title,
  description,
  impact,
  actions,
}: {
  title: string
  description: string
  impact: string
  actions: string[]
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs px-2 py-1 rounded bg-muted">{impact}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>
      <div className="flex gap-2">
        {actions.map((action) => (
          <button
            key={action}
            className="text-xs text-primary hover:underline"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  )
}

