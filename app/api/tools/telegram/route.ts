import { type NextRequest, NextResponse } from "next/server"
import { TelegramTool } from "@/lib/tools/telegram"

export async function POST(req: NextRequest) {
  try {
    const { action, botToken, chatId, message, parseMode, webhookUrl, limit } = await req.json()

    if (!botToken) {
      return NextResponse.json({ error: "Bot token is required" }, { status: 400 })
    }

    const telegramTool = new TelegramTool({ botToken, chatId })

    const result = await telegramTool.execute({
      action,
      chatId,
      message,
      parseMode,
      webhookUrl,
      limit,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing Telegram tool:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
