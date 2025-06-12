"use client"
import { TelegramConfig } from "@/components/agent/telegram-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function TelegramAgentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Telegram AI Agent</h1>
        <p className="text-gray-500">Configure and deploy an AI agent that interacts with users through Telegram.</p>
      </div>

      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          You'll need to create a Telegram bot using BotFather and get your API token before configuring this agent. The
          webhook requires a publicly accessible HTTPS URL.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="configuration" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="conversation">Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4 mt-4">
          <TelegramConfig />
        </TabsContent>

        <TabsContent value="conversation" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>View and manage conversations between your bot and Telegram users.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border rounded-md">
                <p className="text-gray-500">Configure your bot first to view conversations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>View statistics about your Telegram bot usage.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 border rounded-md">
                <p className="text-gray-500">No analytics data available yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
