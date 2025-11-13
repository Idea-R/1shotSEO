import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function AcquisitionPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Acquisition & Ads</h1>
          <p className="text-muted-foreground mt-2">
            Analyze traffic sources and Google Ads performance
          </p>
        </div>

        {/* Channel Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Channel Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">7D</Button>
                <Button variant="default" size="sm">28D</Button>
                <Button variant="outline" size="sm">90D</Button>
              </div>
              <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg">
                Channel breakdown chart placeholder
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { channel: "Organic", sessions: 5432, change: "+12%" },
                  { channel: "Paid", sessions: 2341, change: "+8%" },
                  { channel: "Social", sessions: 1234, change: "+15%" },
                  { channel: "Direct", sessions: 987, change: "+5%" },
                ].map((ch) => (
                  <div key={ch.channel} className="border rounded-lg p-4">
                    <div className="text-sm text-muted-foreground">{ch.channel}</div>
                    <div className="text-xl font-bold mt-1">{ch.sessions.toLocaleString()}</div>
                    <div className="text-xs text-green-600 mt-1">{ch.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Ads */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Google Ads</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="campaigns">
              <TabsList>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="adgroups">Ad Groups</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
              </TabsList>
              <TabsContent value="campaigns" className="mt-4">
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Campaign</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Clicks</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Impressions</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Cost</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Conv.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Brand Campaign", clicks: 1234, impressions: 45678, cost: 1234.56, conv: 45, roas: 3.2 },
                        { name: "Product Campaign", clicks: 987, impressions: 34567, cost: 987.65, conv: 32, roas: 2.8 },
                      ].map((camp) => (
                        <tr key={camp.name} className="border-t">
                          <td className="px-4 py-3 text-sm font-medium">{camp.name}</td>
                          <td className="px-4 py-3 text-sm">{camp.clicks.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">{camp.impressions.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">${camp.cost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">{camp.conv}</td>
                          <td className="px-4 py-3 text-sm">{camp.roas.toFixed(2)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="adgroups" className="mt-4">
                <div className="text-muted-foreground">Ad groups data...</div>
              </TabsContent>
              <TabsContent value="keywords" className="mt-4">
                <div className="text-muted-foreground">Keywords data...</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

