"use client"

import { useState, useEffect } from "react"
import { Search, FileText, Search as SearchIcon, TrendingUp, CheckSquare, Settings, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const searchItems = [
  { type: "page", label: "Dashboard", href: "/", icon: LayoutDashboard },
  { type: "page", label: "Sites & Content", href: "/sites", icon: FileText },
  { type: "page", label: "Visibility", href: "/visibility", icon: SearchIcon },
  { type: "page", label: "Acquisition & Ads", href: "/acquisition", icon: TrendingUp },
  { type: "page", label: "Tasks & Alerts", href: "/tasks", icon: CheckSquare },
  { type: "page", label: "Settings", href: "/settings", icon: Settings },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const filteredItems = searchItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-lg">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Quickly navigate to any page or search for content</DialogDescription>
        </DialogHeader>
        <div className="px-4 pb-4">
          <div className="flex items-center border-b px-3 mb-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search pages, sites, keywords, tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="py-2">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Pages</div>
                {filteredItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        router.push(item.href)
                        setOpen(false)
                        setQuery("")
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-sm cursor-pointer hover:bg-accent text-left"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

