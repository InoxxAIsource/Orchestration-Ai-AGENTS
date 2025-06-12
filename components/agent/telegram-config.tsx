"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Copy } from "lucide-react"
import { toast } from "sonner"
import { TelegramTool } from "@/lib/tools/telegram"

export function TelegramConfig() {
  const [botToken, setBotToken] = useState("")
  const [chatId, setChatId] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [defaultMessage, setDefaultMessage] = useState("Hello from InoxxAI! I'm your AI assistant.")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isSettingWebhook, setIsSettingWebhook] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState<"none" | "success" | "error" | "pending">("none")
  const [updates, setUpdates] = useState<any[]>([])
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false)

  const validateBot = async () => {
    if (!botToken) {
      toast.error("Please enter a bot token")
      return
    }

    setIsValidating(true)
    setIsValid(null)

    try {
      const telegramTool = new TelegramTool({ botToken })
      const isValid = await telegramTool.validate()

      setIsValid(isValid)
      if (isValid) {
        toast.success("Bot token is valid!")
      } else {
        toast.error("Invalid bot token. Please check and try again.")
      }
    } catch (error) {
      console.error("Error validating bot:", error)
      setIsValid(false)
      toast.error("Failed to validate bot token")
    } finally {
      setIsValidating(false)
    }
  }

  const setWebhook = async () => {
    if (!botToken) {
      toast.error("Please enter a bot token")
      return
    }

    if (!webhookUrl) {
      toast.error("Please enter a webhook URL")
      return
    }

    setIsSettingWebhook(true)
    setWebhookStatus("pending")

    try {
      const telegramTool = new TelegramTool({ botToken })
      const result = await telegramTool.execute({
        action: "setWebhook",
        webhookUrl,
      })

      if (result.success) {
        setWebhookStatus("success")
        toast.success("Webhook set successfully!")
      } else {
        setWebhookStatus("error")
        toast.error("Failed to set webhook")
      }
    } catch (error) {
      console.error("Error setting webhook:", error)
      setWebhookStatus("error")
      toast.error("Failed to set webhook")
    } finally {
      setIsSettingWebhook(false)
    }
  }

  const getUpdates = async () => {
    if (!botToken) {
      toast.error("Please enter a bot token")
      return
    }

    setIsLoadingUpdates(true)
    setUpdates([])

    try {
      const telegramTool = new TelegramTool({ botToken })
      const result = await telegramTool.execute({
        action: "getUpdates",
        limit: 5,
      })

      if (result.success) {
        setUpdates(result.updates || [])
        if (result.updates?.length === 0) {
          toast.info("No recent updates found")
        } else {
          toast.success(`Loaded ${result.updates.length} recent updates`)
        }
      } else {
        toast.error("Failed to get updates")
      }
    } catch (error) {
      console.error("Error getting updates:", error)
      toast.error("Failed to get updates")
    } finally {
      setIsLoadingUpdates(false)
    }
  }

  const sendTestMessage = async () => {
    if (!botToken) {
      toast.error("Please enter a bot token")
      return
    }

    if (!chatId) {
      toast.error("Please enter a chat ID")
      return
    }

    try {
      const telegramTool = new TelegramTool({ botToken, chatId })
      const result = await telegramTool.execute({
        action: "sendMessage",
        message: defaultMessage,
      })

      if (result.success) {
        toast.success("Test message sent successfully!")
      } else {
        toast.error("Failed to send test message")
      }
    } catch (error) {
      console.error("Error sending test message:", error)
      toast.error("Failed to send test message")
    }
  }

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast.success(message)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
          Telegram Bot Configuration
        </CardTitle>
        <CardDescription>
          Configure your Telegram bot to work with InoxxAI. You'll need to create a bot using BotFather first.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bot-token">Bot Token</Label>
              <div className="flex gap-2">
                <Input
                  id="bot-token"
                  type="password"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
                <Button onClick={validateBot} disabled={isValidating}>
                  {isValidating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Validate
                </Button>
              </div>
              {isValid !== null && (
                <div className="flex items-center mt-1">
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">Valid bot token</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-600">Invalid bot token</span>
                    </>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Get your bot token from{" "}
                <a
                  href="https://t.me/botfather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  BotFather
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chat-id">Chat ID</Label>
              <Input id="chat-id" placeholder="123456789" value={chatId} onChange={(e) => setChatId(e.target.value)} />
              <p className="text-xs text-gray-500">
                The chat ID where messages will be sent. Use{" "}
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  @userinfobot
                </a>{" "}
                to get your ID.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-message">Default Message</Label>
              <Textarea
                id="default-message"
                placeholder="Hello from InoxxAI!"
                value={defaultMessage}
                onChange={(e) => setDefaultMessage(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/api/telegram/webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
                <Button variant="outline" onClick={() => copyToClipboard(webhookUrl, "Webhook URL copied!")}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your webhook URL should be a publicly accessible HTTPS endpoint that Telegram can send updates to.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={setWebhook} disabled={isSettingWebhook} className="flex-1">
                {isSettingWebhook ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Set Webhook
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  copyToClipboard(
                    `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`,
                    "SetWebhook URL copied!",
                  )
                }
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </Button>
            </div>

            {webhookStatus !== "none" && (
              <div className="flex items-center mt-1">
                {webhookStatus === "success" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Webhook set successfully</span>
                  </>
                ) : webhookStatus === "error" ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">Failed to set webhook</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    <span className="text-sm">Setting webhook...</span>
                  </>
                )}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md border mt-4">
              <h4 className="text-sm font-medium mb-2">Webhook Endpoint</h4>
              <p className="text-xs text-gray-600 mb-2">
                Your application should expose this endpoint to receive Telegram updates:
              </p>
              <div className="bg-gray-100 p-2 rounded flex items-center justify-between">
                <code className="text-xs">/api/telegram/webhook</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard("/api/telegram/webhook", "Webhook endpoint path copied!")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Button onClick={sendTestMessage} className="flex-1">
                Send Test Message
              </Button>
              <Button variant="outline" onClick={getUpdates} disabled={isLoadingUpdates} className="flex-1">
                {isLoadingUpdates ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Get Recent Updates
              </Button>
            </div>

            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Recent Updates</h4>
              {updates.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {updates.map((update) => (
                    <div key={update.update_id} className="bg-gray-50 p-3 rounded-md border text-xs">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-xs">
                          Update #{update.update_id}
                        </Badge>
                        <span className="text-gray-500">{new Date(update.message?.date * 1000).toLocaleString()}</span>
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">From:</span>{" "}
                        {update.message?.from?.username
                          ? `@${update.message.from.username}`
                          : update.message?.from?.first_name || "Unknown"}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Chat ID:</span> {update.message?.chat?.id}
                      </div>
                      <div>
                        <span className="font-medium">Message:</span> {update.message?.text || "(No text)"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : isLoadingUpdates ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md border text-center">
                  <p className="text-sm text-gray-500">No updates found or not fetched yet</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Testing Tips</h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>Make sure your bot is added to the chat specified by the Chat ID</li>
                <li>For group chats, you need to add the bot as an administrator</li>
                <li>Test your bot by sending a message to it directly in Telegram, then click "Get Recent Updates"</li>
                <li>
                  If using webhooks, ensure your server is publicly accessible and the webhook URL is correctly set
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Configuration</Button>
      </CardFooter>
    </Card>
  )
}
