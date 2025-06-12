import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Define tool interfaces
interface Tool {
  name: string
  description: string
  execute: (params: any) => Promise<any>
}

// Tool registry
const tools: Record<string, Tool> = {
  "http-request": {
    name: "http-request",
    description: "Make HTTP requests to external APIs",
    execute: async (params: { url: string; method: string; headers?: Record<string, string>; body?: any }) => {
      try {
        const { url, method, headers = {}, body } = params
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        })

        const data = await response.json()
        return {
          status: response.status,
          data,
        }
      } catch (error) {
        console.error("HTTP request failed:", error)
        return { error: "Failed to execute HTTP request" }
      }
    },
  },

  postgres: {
    name: "postgres",
    description: "Query PostgreSQL database",
    execute: async (params: { query: string; values?: any[] }) => {
      // In a real implementation, this would connect to a PostgreSQL database
      // For demo purposes, we'll simulate a response
      console.log("Executing PostgreSQL query:", params.query)
      return {
        rows: [
          { id: 1, name: "Sample Data 1" },
          { id: 2, name: "Sample Data 2" },
        ],
        rowCount: 2,
      }
    },
  },

  llm: {
    name: "llm",
    description: "Generate text using a large language model",
    execute: async (params: { prompt: string; model?: string }) => {
      try {
        const { prompt, model = "gpt-3.5-turbo" } = params

        // Use the AI SDK to generate text
        const { text } = await generateText({
          model: openai(model as any),
          prompt,
        })

        return { text }
      } catch (error) {
        console.error("LLM generation failed:", error)
        return { error: "Failed to generate text with LLM" }
      }
    },
  },
}

// Memory interface
interface Memory {
  add: (message: { role: string; content: string }) => void
  get: () => Array<{ role: string; content: string }>
  clear: () => void
}

// Simple memory implementation
class SimpleMemory implements Memory {
  private messages: Array<{ role: string; content: string }> = []

  add(message: { role: string; content: string }) {
    this.messages.push(message)
    // Keep only the last 10 messages to avoid context overflow
    if (this.messages.length > 10) {
      this.messages = this.messages.slice(-10)
    }
  }

  get() {
    return [...this.messages]
  }

  clear() {
    this.messages = []
  }
}

// AI Agent service
export class AIAgentService {
  private memory: Memory

  constructor(memoryType: "simple" | "none" = "simple") {
    this.memory =
      memoryType === "simple"
        ? new SimpleMemory()
        : {
            add: () => {},
            get: () => [],
            clear: () => {},
          }
  }

  async executeAgent(config: {
    systemMessage: string
    tools: string[]
    userInput?: string
  }) {
    const { systemMessage, tools: toolNames, userInput } = config

    // Filter available tools based on configuration
    const availableTools = toolNames.filter((name) => tools[name]).map((name) => tools[name])

    // Build tool descriptions for the system message
    const toolDescriptions = availableTools.map((tool) => `${tool.name}: ${tool.description}`).join("\n")

    // Build the full system message with tool descriptions
    const fullSystemMessage = `${systemMessage}\n\nAvailable tools:\n${toolDescriptions}\n\nWhen you need to use a tool, respond with:\n{\"tool\": \"tool_name\", \"params\": {\"param1\": \"value1\"}}`

    // Add system message to memory
    this.memory.add({ role: "system", content: fullSystemMessage })

    // Add user input to memory if provided
    if (userInput) {
      this.memory.add({ role: "user", content: userInput })
    }

    // Get conversation history
    const messages = this.memory.get()

    try {
      // Generate initial response
      const { text: initialResponse } = await generateText({
        model: openai("gpt-4"),
        messages,
      })

      // Parse the response to check for tool calls
      const toolCalls: Array<{ tool: string; params: any }> = []
      try {
        // Look for JSON in the response
        const jsonMatch = initialResponse.match(/\{[\s\S]*?\}/g)
        if (jsonMatch) {
          const parsedJson = JSON.parse(jsonMatch[0])
          if (parsedJson.tool && tools[parsedJson.tool]) {
            toolCalls.push({
              tool: parsedJson.tool,
              params: parsedJson.params || {},
            })
          }
        }
      } catch (error) {
        console.log("No valid tool call found in response")
      }

      // Execute tool calls and collect results
      const toolResults = []
      for (const call of toolCalls) {
        if (tools[call.tool]) {
          const result = await tools[call.tool].execute(call.params)
          toolResults.push({
            tool: call.tool,
            input: call.params,
            output: result,
          })

          // Add tool result to memory
          this.memory.add({
            role: "function",
            content: JSON.stringify(result),
            name: call.tool,
          })
        }
      }

      // If tools were used, generate a final response
      let finalResponse = initialResponse
      if (toolResults.length > 0) {
        const { text } = await generateText({
          model: openai("gpt-4"),
          messages: [
            ...this.memory.get(),
            { role: "user", content: "Please provide your final answer based on the tool results." },
          ],
        })
        finalResponse = text
      }

      // Return the complete result
      return {
        response: finalResponse,
        reasoning: "I analyzed the request and determined the best approach based on available tools.",
        toolCalls: toolResults,
        executionTime: Math.floor(Math.random() * 2000) + 500, // Simulated execution time
      }
    } catch (error) {
      console.error("AI Agent execution failed:", error)
      return {
        error: "Failed to execute AI Agent",
        details: error instanceof Error ? error.message : String(error),
      }
    }
  }
}

export default AIAgentService
