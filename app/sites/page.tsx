import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ExternalLink, FileText } from "lucide-react"

export default function SitesPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sites & Content</h1>
            <p className="text-muted-foreground mt-2">
              Manage your sites and explore content performance
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </div>

        {/* Sites List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { domain: "example.com", pages: 234, status: "active" },
            { domain: "blog.example.com", pages: 156, status: "active" },
            { domain: "shop.example.com", pages: 89, status: "active" },
          ].map((site) => (
            <Card key={site.domain} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{site.domain}</span>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    {site.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pages</span>
                    <span className="font-medium">{site.pages}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Content
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Explorer */}
        <Card>
          <CardHeader>
            <CardTitle>Content Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Filter by URL, title, or keyword..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>All Sites</option>
                </select>
                <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Sort by Traffic</option>
                </select>
              </div>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Traffic</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Links</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { url: "/blog/seo-guide", traffic: 1234, rank: 3, links: 45 },
                      { url: "/products", traffic: 987, rank: 5, links: 32 },
                      { url: "/about", traffic: 654, rank: 8, links: 18 },
                    ].map((page) => (
                      <tr key={page.url} className="border-t">
                        <td className="px-4 py-3 text-sm">{page.url}</td>
                        <td className="px-4 py-3 text-sm">{page.traffic.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">#{page.rank}</td>
                        <td className="px-4 py-3 text-sm">{page.links}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">Open</Button>
                            <Button variant="ghost" size="sm">Brief</Button>
                            <Button variant="ghost" size="sm">Task</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

