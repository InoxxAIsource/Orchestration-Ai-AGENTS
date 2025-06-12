"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, User, Loader2, Clock, Zap, Play, CheckCircle } from "lucide-react"
import type { Agent } from "@/types/agent"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  toolCalls?: Array<{
    tool: string
    input: any
    output: any
    executionTime: number
    status: "success" | "error" | "running"
  }>
  reasoning?: string
  executionTime?: number
  taskStatus?: "pending" | "running" | "completed" | "failed"
}

interface AgentTesterProps {
  agent: Agent | null
  onSelectAgent: () => void
}

export function AgentTester({ agent, onSelectAgent }: AgentTesterProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateTaskExecution = async (taskDescription: string, agent: Agent) => {
    const steps = [
      "Analyzing task requirements...",
      "Selecting appropriate tools...",
      "Executing task steps...",
      "Validating results...",
      "Task completed successfully!",
    ]

    const toolCalls = []

    // Simulate tool usage based on agent's configured tools
    for (const tool of agent.tools.slice(0, 2)) {
      // Use first 2 tools
      const toolCall = {
        tool,
        input: { task: taskDescription, parameters: "auto-configured" },
        output: { result: `${tool} executed successfully`, data: "Sample output data" },
        executionTime: Math.floor(Math.random() * 1000) + 200,
        status: "success" as const,
      }
      toolCalls.push(toolCall)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    return {
      response: `Task "${taskDescription}" has been completed successfully. I used ${agent.tools.length} tools to accomplish this task: ${agent.tools.join(", ")}. The task involved multiple steps including analysis, execution, and validation.`,
      reasoning: `I broke down your task into manageable steps and used the most appropriate tools from my toolkit. The task was executed using ${agent.model} with temperature ${agent.temperature} for optimal results.`,
      toolCalls,
      executionTime: Math.floor(Math.random() * 3000) + 1000,
      taskStatus: "completed" as const,
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !agent || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      taskStatus: "pending",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input.trim()
    setInput("")
    setIsLoading(true)
    setIsStreaming(true)

    // Create placeholder assistant message immediately
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Starting task execution...",
      timestamp: new Date(),
      toolCalls: [],
      reasoning: "",
      executionTime: 0,
      taskStatus: "running",
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      console.log("Executing task with agent:", agent.name, "Task:", currentInput)

      // Simulate real task execution
      const result = await simulateTaskExecution(currentInput, agent)

      // Update the assistant message with the results
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: result.response,
                toolCalls: result.toolCalls,
                reasoning: result.reasoning,
                executionTime: result.executionTime,
                taskStatus: result.taskStatus,
              }
            : msg,
        ),
      )

      // Show success toast
      toast.success(`Task completed successfully by ${agent.name}!`)
    } catch (error) {
      console.error("Error executing task:", error)

      // Update the assistant message with an error response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content:
                  "I encountered an error while executing your task. Please try again with a different approach.",
                taskStatus: "failed",
              }
            : msg,
        ),
      )

      // Show error toast
      toast.error("Task execution failed. Please try again.")
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const getTaskStatusIcon = (status?: string) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
      case "completed":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "failed":
        return <div className="h-3 w-3 rounded-full bg-red-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  if (!agent) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Agent Selected</h3>
          <p className="text-gray-500 mb-4">Select an agent to start executing tasks</p>
          <Button onClick={onSelectAgent}>Select Agent</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              Task Executor: {agent.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isStreaming ? "default" : "secondary"} className="flex items-center gap-1">
              {isStreaming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
              {isStreaming ? "Executing" : "Ready"}
            </Badge>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="text-xs bg-blue-50">
            Model: {agent.model}
          </Badge>
          <Badge variant="outline" className="text-xs bg-green-50">
            Tools: {agent.tools.length}
          </Badge>
          {agent.tools.slice(0, 3).map((tool) => (
            <Badge key={tool} variant="outline" className="text-xs">
              {tool}
            </Badge>
          ))}
          {agent.tools.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{agent.tools.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="font-medium">Ready to execute tasks</p>
                <p className="text-sm">Describe what you want me to do and I'll execute it using my tools</p>
                <div className="mt-4 text-xs bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium mb-1">Example tasks:</p>
                  <p>• "Send a tweet about AI automation"</p>
                  <p>• "Analyze this data and create a report"</p>
                  <p>• "Search for information about blockchain"</p>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900 border"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.taskStatus && getTaskStatusIcon(message.taskStatus)}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.executionTime && (
                        <div className="flex items-center gap-1 mt-2 text-xs opacity-70">
                          <Clock className="h-3 w-3" />
                          {message.executionTime}ms
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Tool Calls Display */}
                {message.toolCalls && message.toolCalls.length > 0 && (
                  <div className="ml-11 space-y-2">
                    <Separator />
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Tool Executions:
                    </div>
                    {message.toolCalls.map((toolCall, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-green-50">
                              {toolCall.tool}
                            </Badge>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          </div>
                          <span className="text-xs text-gray-500">{toolCall.executionTime}ms</span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div>
                            <span className="font-medium">Input:</span>
                            <pre className="bg-white p-1 rounded text-xs overflow-x-auto">
                              {JSON.stringify(toolCall.input, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <span className="font-medium">Output:</span>
                            <pre className="bg-white p-1 rounded text-xs overflow-x-auto">
                              {JSON.stringify(toolCall.output, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasoning Display */}
                {message.reasoning && (
                  <div className="ml-11">
                    <div className="bg-blue-50 border-l-4 border-blue-200 p-2 rounded">
                      <div className="text-xs font-medium text-blue-800 mb-1">Agent Reasoning:</div>
                      <p className="text-xs text-blue-700">{message.reasoning}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Agent is executing your task...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe the task you want me to execute..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Be specific about what you want to accomplish. I'll use my tools to execute the task.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
