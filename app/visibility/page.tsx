import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, Download } from "lucide-react"

export default function VisibilityPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Visibility (SEO)</h1>
            <p className="text-muted-foreground mt-2">
              Track keywords, backlinks, and competitor performance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Keywords
          </Button>
        </div>

        {/* Keywords Section */}
        <Card>
          <CardHeader>
            <CardTitle>Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search keywords..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Total Keywords</div>
                  <div className="text-2xl font-bold mt-1">1,234</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Winners</div>
                  <div className="text-2xl font-bold mt-1 text-green-600">456</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground">Losers</div>
                  <div className="text-2xl font-bold mt-1 text-red-600">123</div>
                </div>
              </div>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Keyword</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Position</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Change</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Intent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { keyword: "SEO tools", position: 3, change: +2, intent: "Commercial" },
                      { keyword: "content marketing", position: 5, change: -1, intent: "Informational" },
                      { keyword: "keyword research", position: 8, change: +3, intent: "Informational" },
                    ].map((kw) => (
                      <tr key={kw.keyword} className="border-t">
                        <td className="px-4 py-3 text-sm font-medium">{kw.keyword}</td>
                        <td className="px-4 py-3 text-sm">#{kw.position}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`flex items-center gap-1 ${kw.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {kw.change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            {Math.abs(kw.change)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{kw.intent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Backlinks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">New Backlinks</div>
                <div className="text-2xl font-bold mt-1 text-green-600">+45</div>
                <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Lost Backlinks</div>
                <div className="text-2xl font-bold mt-1 text-red-600">-12</div>
                <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Referring Domains</div>
                <div className="text-2xl font-bold mt-1">234</div>
                <div className="text-xs text-muted-foreground mt-1">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors Section */}
        <Card>
          <CardHeader>
            <CardTitle>Competitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { domain: "competitor1.com", overlap: 0.65, sov: 0.23 },
                { domain: "competitor2.com", overlap: 0.52, sov: 0.18 },
              ].map((comp) => (
                <div key={comp.domain} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{comp.domain}</div>
                      <div className="text-sm text-muted-foreground">
                        Overlap: {(comp.overlap * 100).toFixed(0)}% | SOV: {(comp.sov * 100).toFixed(0)}%
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

