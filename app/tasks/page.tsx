import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Download, Bell } from "lucide-react"

export default function TasksPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Tasks & Alerts</h1>
            <p className="text-muted-foreground mt-2">
              Manage tasks and monitor alerts
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Tasks</CardTitle>
                  <div className="flex gap-2">
                    <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>All Status</option>
                      <option>Todo</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Task</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Assignee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          title: "Fix CWV on /products",
                          type: "Technical",
                          priority: "High",
                          status: "In Progress",
                          due: "2024-01-15",
                          assignee: "John Doe",
                        },
                        {
                          title: "Create content brief for SEO guide",
                          type: "Content",
                          priority: "Medium",
                          status: "Todo",
                          due: "2024-01-20",
                          assignee: "Jane Smith",
                        },
                      ].map((task) => (
                        <tr key={task.title} className="border-t">
                          <td className="px-4 py-3 text-sm font-medium">{task.title}</td>
                          <td className="px-4 py-3 text-sm">{task.type}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-xs">
                              {task.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{task.status}</td>
                          <td className="px-4 py-3 text-sm">{task.due}</td>
                          <td className="px-4 py-3 text-sm">{task.assignee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendar View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-muted-foreground border rounded-lg">
                  Calendar component placeholder
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "Rank Drop",
                      message: "Keyword 'SEO tools' dropped from position 3 to 7",
                      severity: "High",
                      site: "example.com",
                    },
                    {
                      type: "CWV Regression",
                      message: "LCP increased by 200ms on /products",
                      severity: "Medium",
                      site: "example.com",
                    },
                    {
                      type: "Spend Anomaly",
                      message: "Google Ads spend increased 50% vs last week",
                      severity: "Medium",
                      site: "example.com",
                    },
                  ].map((alert) => (
                    <div key={alert.message} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-muted-foreground mt-1">{alert.message}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.site}</div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.severity === "High"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}>
                            {alert.severity}
                          </span>
                          <Button variant="ghost" size="sm">Dismiss</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}

