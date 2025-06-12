import { z } from "zod"

export interface TelegramConfig {
  botToken: string
  chatId?: string
  defaultMessage?: string
}

export const TelegramConfigSchema = z.object({
  botToken: z.string().min(1, "Bot token is required"),
  chatId: z.string().optional(),
  defaultMessage: z.string().optional(),
})

export class TelegramTool {
  private config: TelegramConfig
  private baseUrl: string

  constructor(config: TelegramConfig) {
    this.config = TelegramConfigSchema.parse(config)
    this.baseUrl = `https://api.telegram.org/bot${this.config.botToken}`
  }

  async validate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`)
      const data = await response.json()
      return data.ok === true
    } catch (error) {
      console.error("Failed to validate Telegram bot:", error)
      return false
    }
  }

  async execute(params: {
    action: "sendMessage" | "getUpdates" | "setWebhook" | "deleteWebhook"
    chatId?: string
    message?: string
    parseMode?: "Markdown" | "HTML"
    webhookUrl?: string
    limit?: number
  }) {
    try {
      const {
        action,
        chatId = this.config.chatId,
        message = this.config.defaultMessage,
        parseMode,
        webhookUrl,
        limit,
      } = params

      switch (action) {
        case "sendMessage": {
          if (!chatId) throw new Error("Chat ID is required for sending messages")
          if (!message) throw new Error("Message is required for sending messages")

          const response = await fetch(`${this.baseUrl}/sendMessage`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: parseMode,
            }),
          })

          const data = await response.json()
          return {
            success: data.ok,
            messageId: data.result?.message_id,
            timestamp: new Date().toISOString(),
            details: data,
          }
        }

        case "getUpdates": {
          const response = await fetch(`${this.baseUrl}/getUpdates?limit=${limit || 10}`)
          const data = await response.json()
          return {
            success: data.ok,
            updates: data.result,
            count: data.result?.length || 0,
          }
        }

        case "setWebhook": {
          if (!webhookUrl) throw new Error("Webhook URL is required for setting webhook")

          const response = await fetch(`${this.baseUrl}/setWebhook`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: webhookUrl,
            }),
          })

          const data = await response.json()
          return {
            success: data.ok,
            webhookUrl,
            details: data,
          }
        }

        case "deleteWebhook": {
          const response = await fetch(`${this.baseUrl}/deleteWebhook`)
          const data = await response.json()
          return {
            success: data.ok,
            details: data,
          }
        }

        default:
          throw new Error(`Unsupported action: ${action}`)
      }
    } catch (error) {
      console.error("Telegram tool execution failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }
}
