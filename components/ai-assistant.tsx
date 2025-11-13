"use client"

import { useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generateAIResponse } from "@/lib/ai"
import { toast } from "sonner"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await generateAIResponse(input)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      toast.error("Failed to get AI response")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">
                Ask me anything about your SEO, content, analytics, or performance.
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={`inline-block rounded-lg px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-sm text-muted-foreground">Thinking...</div>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              disabled={loading}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

