"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createMonthlyReport, createPortfolioReport, createExecutiveReport, sendReportAction } from "@/app/actions/reporting"
import { FileText, Send, Download, Eye } from "lucide-react"
import { toast } from "sonner"

interface ReportViewerProps {
  reportId?: string
  html?: string
}

export function ReportViewer({ reportId, html }: ReportViewerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(html || null)
  const [currentReportId, setCurrentReportId] = useState<string | undefined>(reportId)

  const handleGenerateReport = async (type: "monthly_site" | "portfolio" | "executive") => {
    setIsGenerating(true)
    try {
      const siteIds = ["site-1"] // TODO: Get from context
      const result = await (type === "monthly_site" 
        ? createMonthlyReport(siteIds)
        : type === "portfolio"
        ? createPortfolioReport(siteIds)
        : createExecutiveReport(siteIds))

      if (result.success && result.html) {
        setGeneratedHtml(result.html)
        if (result.reportId) {
          setCurrentReportId(result.reportId)
        }
        toast.success("Report generated successfully!")
      } else {
        toast.error(result.error || "Failed to generate report")
      }
    } catch (error) {
      toast.error("Error generating report")
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSendReport = async () => {
    if (!currentReportId) {
      toast.error("No report to send")
      return
    }

    const recipients = ["demo@example.com"] // TODO: Get from form/context
    const result = await sendReportAction(currentReportId, recipients, "email")

    if (result.success) {
      toast.success("Report sent successfully!")
    } else {
      toast.error(result.error || "Failed to send report")
    }
  }

  const handleDownloadReport = () => {
    if (!generatedHtml) {
      toast.error("No report to download")
      return
    }

    const blob = new Blob([generatedHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${new Date().toISOString().split("T")[0]}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Report downloaded!")
  }

  if (generatedHtml) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>
          <Button onClick={handleSendReport} variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Send Report
          </Button>
          <Button onClick={() => setGeneratedHtml(null)} variant="outline">
            Generate New Report
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <iframe
            srcDoc={generatedHtml}
            className="w-full h-[800px] border-0"
            title="Report Preview"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Generate Reports</h2>
        <p className="text-muted-foreground">
          Create comprehensive reports for your sites and portfolios
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGenerateReport("monthly_site")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Monthly Site Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive monthly report for a single site covering traffic, SEO, content, and performance.
            </p>
            <Button disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGenerateReport("portfolio")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Portfolio Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Rollup report across all sites in your portfolio with cross-site analysis and insights.
            </p>
            <Button disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleGenerateReport("executive")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              High-level 1-pager summary with key metrics, wins, losses, and action items.
            </p>
            <Button disabled={isGenerating} className="w-full">
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


