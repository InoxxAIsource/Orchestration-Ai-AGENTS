import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { message, agent } = await req.json()

    if (!message || !agent) {
      return NextResponse.json(
        {
          error: "Missing required fields: message and agent",
        },
        { status: 400 },
      )
    }

    console.log("Testing agent:", agent.name, "with message:", message)

    // Use the AI SDK to generate a response
    const { text, usage } = await generateText({
      model: openai(agent.model || "gpt-3.5-turbo"),
      system: agent.systemPrompt || "You are a helpful AI assistant.",
      prompt: message,
      temperature: agent.temperature || 0.7,
      maxTokens: 500,
    })

    const response = {
      response: text,
      reasoning: `Used ${agent.model || "gpt-3.5-turbo"} with temperature ${agent.temperature || 0.7}`,
      toolCalls:
        agent.tools?.map((tool: string) => ({
          tool,
          input: message,
          output: `Simulated ${tool} execution`,
          duration: Math.floor(Math.random() * 1000) + 100,
        })) || [],
      executionTime: usage?.totalTokens ? `${usage.totalTokens} tokens` : "Unknown",
      usage,
    }

    console.log("Agent response generated:", response)
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error testing agent:", error)

    // Fallback response if AI API fails
    const fallbackResponse = {
      response: `I'm a ${req.body?.agent?.name || "test"} agent. I received your message: "${req.body?.message || "test"}" but I'm currently in demo mode. The real AI integration will be available once the OpenAI API key is configured.`,
      reasoning: "Fallback response - AI API not configured",
      toolCalls: [],
      executionTime: "0ms",
      error: error instanceof Error ? error.message : String(error),
    }

    return NextResponse.json(fallbackResponse)
  }
}

export const dynamic = "force-dynamic"
