import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Plus, Send, FileText } from "lucide-react"
import { ReportViewer } from "@/components/report-viewer"
import { testConnection } from "@/lib/connectors"
import { useState } from "react"
import { toast } from "sonner"

"use client"

export default function SettingsPage() {
  const [testingConnector, setTestingConnector] = useState<string | null>(null)

  const handleTestConnection = async (connector: "ga4" | "gsc" | "ads" | "lighthouse" | "crawler") => {
    setTestingConnector(connector)
    try {
      const result = await testConnection(connector)
      if (result.success) {
        toast.success(`${connector.toUpperCase()} connection test: ${result.data?.message || "Success"}`)
      } else {
        toast.error(result.error || "Connection test failed")
      }
    } catch (error) {
      toast.error("Connection test failed")
    } finally {
      setTestingConnector(null)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure connections, sites, users, and reporting
          </p>
        </div>

        <Tabs defaultValue="connections">
          <TabsList>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-6">
            <div className="space-y-4">
              {[
                { name: "Google Analytics 4", status: "connected", icon: "GA4", key: "ga4" as const },
                { name: "Google Search Console", status: "connected", icon: "GSC", key: "gsc" as const },
                { name: "Google Ads", status: "not_connected", icon: "Ads", key: "ads" as const },
                { name: "Lighthouse", status: "connected", icon: "LH", key: "lighthouse" as const },
              ].map((conn) => (
                <Card key={conn.name}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center font-bold">
                          {conn.icon}
                        </div>
                        <div>
                          <div className="font-medium">{conn.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {conn.status === "connected" ? "Connected" : "Not connected"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {conn.status === "connected" ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestConnection(conn.key)}
                              disabled={testingConnector === conn.key}
                            >
                              {testingConnector === conn.key ? "Testing..." : "Test"}
                            </Button>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-muted-foreground" />
                            <Button size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Connect
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sites" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Sites</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      domain: "example.com",
                      sitemap: "https://example.com/sitemap.xml",
                      crawlRate: "Normal",
                    },
                    {
                      domain: "blog.example.com",
                      sitemap: "https://blog.example.com/sitemap.xml",
                      crawlRate: "Normal",
                    },
                  ].map((site) => (
                    <div key={site.domain} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{site.domain}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Sitemap: {site.sitemap}
                          </div>
                          <div className="text-sm text-muted-foreground">Crawl Rate: {site.crawlRate}</div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Users & Roles</CardTitle>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { email: "admin@example.com", role: "Admin" },
                        { email: "editor@example.com", role: "Editor" },
                        { email: "viewer@example.com", role: "Viewer" },
                      ].map((user) => (
                        <tr key={user.email} className="border-t">
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm">{user.role}</td>
                          <td className="px-4 py-3 text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting" className="mt-6">
            <ReportViewer />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

