import OpenAI from "openai"

let openaiClient: OpenAI | null = null

export function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "sk-placeholder") {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export async function generateAIResponse(
  prompt: string,
  context?: Record<string, any>
): Promise<string> {
  const client = getOpenAIClient()
  if (!client) {
    // Return mock response in demo mode
    return `Based on your request: "${prompt}", here's a sample AI-generated insight:\n\nIn demo mode, AI features require OPENAI_API_KEY to be configured. The system is currently using mock data to demonstrate functionality. Connect your OpenAI API key in Settings to enable full AI capabilities.`
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for 1shotSEO, a website intelligence platform. Provide concise, actionable insights about SEO, content, analytics, and performance.",
        },
        {
          role: "user",
          content: context
            ? `${prompt}\n\nContext: ${JSON.stringify(context, null, 2)}`
            : prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0]?.message?.content || "No response generated."
  } catch (error) {
    console.error("OpenAI API error:", error)
    return "Unable to generate AI response at this time. Using demo mode."
  }
}

