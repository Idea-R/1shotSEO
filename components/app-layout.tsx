"use client"

import { MainNav } from "@/components/main-nav"
import { AIAssistant } from "@/components/ai-assistant"
import { GlobalSearch } from "@/components/global-search"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <AIAssistant />
      <GlobalSearch />
    </div>
  )
}

