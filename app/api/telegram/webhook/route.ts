import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { TelegramTool } from "@/lib/tools/telegram"

// In-memory message history (would use a database in production)
const messageHistory: Record<string, Array<{ role: string; content: string }>> = {}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    console.log("Received Telegram update:", update)

    // Extract message details
    const message = update.message
    if (!message || !message.text) {
      return NextResponse.json({ status: "No message text found" })
    }

    const chatId = message.chat.id.toString()
    const text = message.text
    const username = message.from.username || message.from.first_name || "User"

    // Get bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN not configured")
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 })
    }

    // Initialize Telegram tool
    const telegramTool = new TelegramTool({ botToken, chatId })

    // Initialize or get chat history
    if (!messageHistory[chatId]) {
      messageHistory[chatId] = [
        {
          role: "system",
          content:
            "You are a helpful AI assistant integrated with Telegram. Respond concisely and helpfully to user queries. You can use Markdown formatting for your responses.",
        },
      ]
    }

    // Add user message to history
    messageHistory[chatId].push({ role: "user", content: text })

    // Trim history if it gets too long (keep last 10 messages)
    if (messageHistory[chatId].length > 12) {
      // Keep system message and last 10 exchanges
      messageHistory[chatId] = [
        messageHistory[chatId][0],
        ...messageHistory[chatId].slice(messageHistory[chatId].length - 10),
      ]
    }

    try {
      // Send "typing" indicator
      await telegramTool.execute({
        action: "sendMessage",
        message: "⌛ Processing your request...",
      })

      // Generate response with OpenAI
      const { text: aiResponse } = await generateText({
        model: openai("gpt-4o"),
        messages: messageHistory[chatId],
      })

      // Add AI response to history
      messageHistory[chatId].push({ role: "assistant", content: aiResponse })

      // Send response back to Telegram
      const result = await telegramTool.execute({
        action: "sendMessage",
        message: aiResponse,
        parseMode: "Markdown",
      })

      return NextResponse.json({
        status: "success",
        response: aiResponse,
        telegramResponse: result,
      })
    } catch (error) {
      console.error("Error generating or sending response:", error)

      // Send error message to Telegram
      await telegramTool.execute({
        action: "sendMessage",
        message: "Sorry, I encountered an error processing your request. Please try again later.",
      })

      return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram webhook endpoint is active" })
}

export const dynamic = "force-dynamic"
