"use client"

import { useState, useCallback } from "react"
import type { Node } from "@xyflow/react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Copy, Trash2, Play, X, AlertCircle } from "lucide-react"

export default function NodeConfigPanel({
  node,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  node: Node
  onClose: () => void
  onUpdate: (updatedNode: Node) => void
  onDelete: (nodeId: string) => void
  onDuplicate: (node: Node) => void
}) {
  const [activeTab, setActiveTab] = useState("config")
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionError, setExecutionError] = useState<string | null>(null)

  // Enhanced Zod schemas with AI Agent support
  const getSchema = () => {
    switch (node.data.type) {
      case "webhook":
        return z.object({
          path: z.string().min(1, "Path is required"),
          method: z.enum(["GET", "POST"]).default("POST"),
          authentication: z.enum(["none", "basic", "apiKey"]).default("none"),
          responseMode: z.enum(["onReceived", "onCompleted"]).default("onReceived"),
        })
      case "schedule":
        return z.object({
          rule: z.string().min(1, "Cron rule is required"),
          timezone: z.string().default("America/New_York"),
        })
      case "email-trigger":
        return z.object({
          provider: z.enum(["gmail", "outlook"]).default("gmail"),
          folder: z.string().default("INBOX"),
          filters: z.record(z.any()).optional(),
        })
      case "telegram-trigger":
        return z.object({
          botToken: z.string().min(1, "Bot token is required"),
          chatId: z.string().min(1, "Chat ID is required"),
          triggerOn: z.enum(["message", "command"]).default("message"),
          commands: z.array(z.string()).optional(),
          updates: z.array(z.string()).optional(),
        })
      case "discord-trigger":
        return z.object({
          botToken: z.string().min(1, "Bot token is required"),
          channelId: z.string().min(1, "Channel ID is required"),
          triggerOn: z.enum(["message", "reaction"]).default("message"),
          eventTypes: z.array(z.string()).optional(),
        })
      case "whatsapp-trigger":
        return z.object({
          phoneNumber: z.string().min(1, "Phone number is required"),
          apiKey: z.string().min(1, "API key is required"),
          webhookUrl: z.string().optional(),
          triggerOn: z.enum(["message", "status"]).default("message"),
          messageTypes: z.array(z.string()).optional(),
        })
      case "file-trigger":
        return z.object({
          watchPath: z.string().min(1, "Path is required"),
          event: z.enum(["created", "modified", "deleted"]).default("created"),
        })
      case "manual-trigger":
        return z.object({})
      case "postgres":
      case "mysql":
        return z.object({
          operation: z.enum(["select", "insert", "update", "delete"]).default("select"),
          table: z.string().min(1, "Table is required"),
          columns: z.string().default("*"),
          where: z.string().optional(),
          limit: z.number().optional(),
          query: z.string().optional(),
        })
      case "mongodb":
        return z.object({
          operation: z.enum(["find", "insertOne", "updateOne", "deleteOne"]).default("find"),
          collection: z.string().min(1, "Collection is required"),
          query: z.string().min(1, "Query is required"),
        })
      case "redis":
        return z.object({
          key: z.string().min(1, "Key is required"),
          operation: z.enum(["get", "set", "del"]).default("get"),
        })
      case "csv":
        return z.object({
          operation: z.enum(["read", "write"]).default("read"),
          filePath: z.string().min(1, "File path is required"),
          delimiter: z.string().default(","),
        })
      case "email":
        return z.object({
          to: z.string().email("Valid email required"),
          subject: z.string().min(1, "Subject is required"),
          body: z.string().min(1, "Body is required"),
          attachments: z.array(z.string()).optional(),
        })
      case "slack":
        return z.object({
          channel: z.string().min(1, "Channel is required"),
          message: z.string().min(1, "Message is required"),
          username: z.string().optional(),
        })
      case "telegram":
        return z.object({
          chatId: z.string().min(1, "Chat ID is required"),
          text: z.string().min(1, "Message is required"),
        })
      case "discord":
        return z.object({
          webhook: z.string().url("Valid webhook URL required"),
          content: z.string().min(1, "Content is required"),
        })
      case "whatsapp":
        return z.object({
          phoneNumber: z.string().min(1, "Phone number is required"),
          message: z.string().min(1, "Message is required"),
          messageType: z.enum(["text", "image", "document"]).default("text"),
          mediaUrl: z.string().optional(),
        })
      case "google-sheets":
        return z.object({
          operation: z.enum(["append", "read", "update"]).default("append"),
          spreadsheetId: z.string().min(1, "Spreadsheet ID is required"),
          range: z.string().min(1, "Range is required"),
        })
      case "notion":
        return z.object({
          operation: z.enum(["create", "read", "update"]).default("create"),
          databaseId: z.string().min(1, "Database ID is required"),
        })
      case "airtable":
        return z.object({
          operation: z.enum(["list", "create", "update"]).default("list"),
          baseId: z.string().min(1, "Base ID is required"),
          tableId: z.string().min(1, "Table ID is required"),
        })
      case "google-drive":
      case "dropbox":
        return z.object({
          operation: z.enum(["upload", "download", "list"]).default("upload"),
          path: z.string().min(1, "Path is required"),
          folderId: z.string().optional(),
        })
      case "if":
        return z.object({
          conditions: z.array(
            z.object({
              leftValue: z.string(),
              operation: z.enum(["equal", "notEqual", "contains", "greaterThan", "lessThan"]),
              rightValue: z.string(),
            }),
          ),
          combineOperation: z.enum(["and", "or"]).default("and"),
        })
      case "switch":
        return z.object({
          dataPropertyName: z.string().min(1, "Property name is required"),
          fallbackOutput: z.string().default("default"),
          rules: z.array(z.any()).optional(),
        })
      case "merge":
        return z.object({
          mode: z.enum(["append", "merge"]).default("append"),
          clashHandling: z.enum(["addSuffix", "overwrite"]).default("addSuffix"),
        })
      case "loop":
        return z.object({
          batchSize: z.number().min(1, "Batch size must be at least 1").default(1),
        })
      case "wait":
        return z.object({
          amount: z.number().min(1, "Amount must be at least 1").default(1),
          unit: z.enum(["seconds", "minutes", "hours"]).default("seconds"),
        })
      case "set":
        return z.object({
          keepOnlySet: z.boolean().default(false),
          values: z.record(z.any()).optional(),
        })
      case "function":
        return z.object({
          functionCode: z.string().min(1, "Code is required"),
        })
      case "json":
      case "xml":
        return z.object({
          operation: z.enum(["parse", "stringify"]).default("parse"),
          dataPropertyName: z.string().default("data"),
        })
      case "datetime":
        return z.object({
          action: z.enum(["format", "parse", "add", "subtract"]).default("format"),
          format: z.string().min(1, "Format is required").default("YYYY-MM-DD"),
        })
      case "http-request":
        return z.object({
          url: z.string().url("Valid URL required"),
          method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]).default("GET"),
          headers: z.record(z.string()).optional(),
          body: z.string().optional(),
        })
      case "webhook-response":
        return z.object({
          statusCode: z.number().min(100).max(599).default(200),
          body: z.string().default(""),
          headers: z.record(z.string()).optional(),
        })
      case "graphql":
        return z.object({
          endpoint: z.string().url("Valid URL required"),
          query: z.string().min(1, "Query is required"),
          variables: z.record(z.any()).optional(),
        })
      case "llm":
        return z.object({
          provider: z.enum(["openai", "anthropic", "google"]).default("openai"),
          model: z.string().min(1, "Model is required"),
          apiKey: z.string().min(1, "API key is required"),
          prompt: z.string().min(1, "Prompt is required"),
        })
      case "ai-agent":
        return z.object({
          systemMessage: z.string().min(1, "System message is required"),
          tools: z.array(z.string()).min(1, "At least one tool is required"),
          memory: z.enum(["simple", "none"]).default("simple"),
          userInput: z.string().optional(),
        })
      case "embedding":
        return z.object({
          model: z.string().min(1, "Model is required"),
          input: z.string().min(1, "Input is required"),
        })
      default:
        return z.object({})
    }
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: node.data.config || {},
  })

  const getFieldType = (key: string) => {
    if (key.includes("token") || key.includes("key") || key.includes("secret") || key === "apiKey") return "password"
    if (key === "query" || key === "functionCode") return "code"
    if (
      key === "message" ||
      key === "body" ||
      key === "prompt" ||
      key === "content" ||
      key === "text" ||
      key === "systemMessage" ||
      key === "userInput"
    )
      return "textarea"
    if (
      key === "method" ||
      key === "operation" ||
      key === "provider" ||
      key === "model" ||
      key === "unit" ||
      key === "action" ||
      key === "event" ||
      key === "memory" ||
      key === "triggerOn" ||
      key === "messageType" ||
      key === "authentication" ||
      key === "responseMode" ||
      key === "combineOperation"
    )
      return "select"
    if (key === "tools" || key === "commands" || key === "updates" || key === "eventTypes" || key === "messageTypes")
      return "multiselect"
    if (
      key === "amount" ||
      key === "batchSize" ||
      key === "statusCode" ||
      key === "limit" ||
      key.includes("Count") ||
      key.includes("Size")
    )
      return "number"
    if (key === "keepOnlySet") return "checkbox"
    return "text"
  }

  const getSelectOptions = (key: string) => {
    const options: Record<string, Array<{ value: string; label: string }>> = {
      method: [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
        { value: "PATCH", label: "PATCH" },
      ],
      operation: [
        { value: "select", label: "Select" },
        { value: "insert", label: "Insert" },
        { value: "update", label: "Update" },
        { value: "delete", label: "Delete" },
        { value: "find", label: "Find" },
        { value: "insertOne", label: "Insert One" },
        { value: "updateOne", label: "Update One" },
        { value: "deleteOne", label: "Delete One" },
        { value: "get", label: "Get" },
        { value: "set", label: "Set" },
        { value: "del", label: "Delete" },
        { value: "read", label: "Read" },
        { value: "write", label: "Write" },
        { value: "append", label: "Append" },
        { value: "create", label: "Create" },
        { value: "list", label: "List" },
        { value: "upload", label: "Upload" },
        { value: "download", label: "Download" },
        { value: "parse", label: "Parse" },
        { value: "stringify", label: "Stringify" },
      ],
      provider: [
        { value: "openai", label: "OpenAI" },
        { value: "anthropic", label: "Anthropic" },
        { value: "google", label: "Google" },
        { value: "gmail", label: "Gmail" },
        { value: "outlook", label: "Outlook" },
      ],
      model: [
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
        { value: "claude-3-opus", label: "Claude 3 Opus" },
        { value: "text-embedding-ada-002", label: "Text Embedding Ada 002" },
      ],
      unit: [
        { value: "seconds", label: "Seconds" },
        { value: "minutes", label: "Minutes" },
        { value: "hours", label: "Hours" },
      ],
      action: [
        { value: "format", label: "Format" },
        { value: "parse", label: "Parse" },
        { value: "add", label: "Add" },
        { value: "subtract", label: "Subtract" },
      ],
      event: [
        { value: "created", label: "Created" },
        { value: "modified", label: "Modified" },
        { value: "deleted", label: "Deleted" },
      ],
      mode: [
        { value: "append", label: "Append" },
        { value: "merge", label: "Merge" },
      ],
      memory: [
        { value: "simple", label: "Simple Memory" },
        { value: "none", label: "No Memory" },
      ],
      tools: [
        { value: "http-request", label: "HTTP Request" },
        { value: "postgres", label: "PostgreSQL" },
        { value: "mysql", label: "MySQL" },
        { value: "mongodb", label: "MongoDB" },
        { value: "redis", label: "Redis" },
        { value: "llm", label: "LLM" },
        { value: "email", label: "Email" },
        { value: "slack", label: "Slack" },
        { value: "function", label: "JavaScript Function" },
      ],
      triggerOn: [
        { value: "message", label: "Message" },
        { value: "command", label: "Command" },
        { value: "reaction", label: "Reaction" },
        { value: "status", label: "Status" },
      ],
      messageType: [
        { value: "text", label: "Text" },
        { value: "image", label: "Image" },
        { value: "document", label: "Document" },
      ],
      authentication: [
        { value: "none", label: "None" },
        { value: "basic", label: "Basic Auth" },
        { value: "apiKey", label: "API Key" },
      ],
      responseMode: [
        { value: "onReceived", label: "On Received" },
        { value: "onCompleted", label: "On Completed" },
      ],
      combineOperation: [
        { value: "and", label: "AND" },
        { value: "or", label: "OR" },
      ],
    }
    return options[key] || []
  }

  const onSubmit = useCallback(
    async (data: any) => {
      try {
        // For demo purposes, we'll simulate API call and update locally
        // In production, replace with actual API call:
        // await fetch('/api/nodes/config', { method: 'POST', body: JSON.stringify({ nodeId: node.id, config: data }) })

        onUpdate({
          ...node,
          data: {
            ...node.data,
            config: data,
          },
        })
        reset(data)
        setExecutionError(null)
      } catch (error) {
        console.error("Failed to update node config:", error)
        setExecutionError("Failed to save configuration")
      }
    },
    [node, onUpdate, reset],
  )

  const handleExecute = useCallback(async () => {
    setIsExecuting(true)
    setExecutionError(null)

    try {
      // Simulate different execution based on node type
      let result: any = {}

      if (node.data.type === "ai-agent") {
        // Simulate AI Agent execution
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const tools = node.data.config?.tools || []
        const toolsUsed = tools.length > 0 ? tools.slice(0, Math.floor(Math.random() * tools.length) + 1) : []

        result = {
          response: `I've completed the task by using these tools: ${toolsUsed.join(", ")}`,
          reasoning: "I analyzed the request and determined the best approach was to use these tools in sequence.",
          toolCalls: toolsUsed.map((tool) => ({
            tool,
            input: `Sample input for ${tool}`,
            output: `Sample output from ${tool}`,
          })),
          executionTime: Math.floor(Math.random() * 2000) + 500,
        }
      } else if (node.data.type === "llm") {
        // Simulate LLM API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        result = {
          response: `AI Response to: "${node.data.config?.prompt || "No prompt provided"}"`,
          model: node.data.config?.model || "gpt-3.5-turbo",
          tokens: Math.floor(Math.random() * 500) + 100,
        }
      } else if (node.data.type === "http-request") {
        // Simulate HTTP request
        await new Promise((resolve) => setTimeout(resolve, 1000))
        result = {
          status: 200,
          data: { message: "Request successful", url: node.data.config?.url },
        }
      } else if (node.data.type === "email") {
        // Simulate email sending
        await new Promise((resolve) => setTimeout(resolve, 800))
        result = {
          sent: true,
          to: node.data.config?.to,
          messageId: `msg_${Date.now()}`,
        }
      } else {
        // Generic execution simulation
        await new Promise((resolve) => setTimeout(resolve, 500))
        result = {
          executed: true,
          timestamp: new Date().toISOString(),
          nodeType: node.data.type,
        }
      }

      onUpdate({
        ...node,
        data: {
          ...node.data,
          outputData: result,
          lastRun: new Date().toISOString(),
          executions: (node.data.executions || 0) + 1,
        },
      })
    } catch (error) {
      console.error("Execution failed:", error)
      setExecutionError("Execution failed. Please check your configuration.")
    } finally {
      setIsExecuting(false)
    }
  }, [node, onUpdate])

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-xl">{node.data.icon}</span>
            {node.data.label}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDuplicate(node)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            <Copy className="w-3 h-3" />
            Duplicate
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors disabled:opacity-50"
          >
            <Play className="w-3 h-3" />
            {isExecuting ? "Testing..." : "Test"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["config", "data", "execution"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "config" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">{node.data.description}</div>

            {/* Error Display */}
            {executionError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4" />
                {executionError}
              </div>
            )}

            {/* AI Agent Special UI */}
            {node.data.type === "ai-agent" && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800 mb-2">
                  <strong>AI Agent</strong> orchestrates multiple tools to complete complex tasks. Configure which tools
                  the agent can use and provide instructions in the system message.
                </p>
              </div>
            )}

            {Object.entries(node.data.config || {}).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                  {[
                    "token",
                    "key",
                    "path",
                    "email",
                    "query",
                    "collection",
                    "filePath",
                    "to",
                    "subject",
                    "body",
                    "channel",
                    "message",
                    "phoneNumber",
                    "spreadsheetId",
                    "range",
                    "databaseId",
                    "tableId",
                    "condition",
                    "value",
                    "url",
                    "prompt",
                    "input",
                    "systemMessage",
                    "tools",
                  ].some((required) => key.includes(required)) && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => {
                    const fieldType = getFieldType(key)
                    return (
                      <>
                        {fieldType === "select" ? (
                          <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select...</option>
                            {getSelectOptions(key).map((option: { value: string; label: string }) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : fieldType === "multiselect" ? (
                          <select
                            multiple
                            className="w-full p-2 border border-gray-300 rounded text-sm h-24 focus:ring-2 focus:ring-blue-500"
                            value={Array.isArray(field.value) ? field.value : []}
                            onChange={(e) => {
                              const values = Array.from(e.target.selectedOptions).map((opt) => opt.value)
                              field.onChange(values)
                            }}
                          >
                            {getSelectOptions(key).map((option: { value: string; label: string }) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : fieldType === "textarea" ? (
                          <textarea
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${key}...`}
                          />
                        ) : fieldType === "code" ? (
                          <textarea
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded text-sm font-mono h-24 resize-none bg-gray-50 focus:ring-2 focus:ring-blue-500"
                            placeholder="// Enter your code here..."
                          />
                        ) : fieldType === "password" ? (
                          <input
                            type="password"
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${key}...`}
                          />
                        ) : fieldType === "number" ? (
                          <input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${key}...`}
                          />
                        ) : fieldType === "checkbox" ? (
                          <input
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${key}...`}
                          />
                        )}
                      </>
                    )
                  }}
                />
                {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]?.message}</p>}
                {key.includes("token") && (
                  <p className="text-xs text-gray-500 mt-1">🔒 This field is encrypted and secure</p>
                )}
                {key === "systemMessage" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Instructions for the AI agent on how to use available tools
                  </p>
                )}
                {key === "tools" && (
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple tools</p>
                )}
              </div>
            ))}

            {Object.keys(node.data.config || {}).length === 0 && (
              <div className="text-sm text-gray-500 italic">No configuration options available.</div>
            )}

            <button
              type="submit"
              disabled={!isDirty}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Configuration
            </button>
          </form>
        )}

        {activeTab === "data" && (
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Input Data</div>
              <div className="bg-gray-50 p-3 rounded border text-xs font-mono">
                <pre>{JSON.stringify(node.data.inputData || {}, null, 2)}</pre>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Output Data</div>
              <div className="bg-gray-50 p-3 rounded border text-xs font-mono">
                <pre>{JSON.stringify(node.data.outputData || {}, null, 2)}</pre>
              </div>
            </div>

            {/* AI Agent Special Output */}
            {node.data.type === "ai-agent" && node.data.outputData && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Agent Execution Details</h4>
                {node.data.outputData.toolCalls && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-purple-700">Tools Used:</h5>
                    {node.data.outputData.toolCalls.map((call: any, index: number) => (
                      <div key={index} className="bg-white p-2 rounded border border-purple-100 text-xs">
                        <div className="font-medium">{call.tool}</div>
                        <div className="text-gray-600 mt-1">Input: {call.input}</div>
                        <div className="text-gray-600">Output: {call.output}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "execution" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Executions:</span>
                <span className="font-medium">{node.data.executions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Run:</span>
                <span className="font-medium text-xs">
                  {node.data.lastRun ? new Date(node.data.lastRun).toLocaleString() : "Never"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {node.data.outputData?.executionTime
                    ? `${node.data.outputData.executionTime}ms`
                    : node.data.avgDuration || "-"}
                </span>
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isExecuting ? "Testing Node..." : "Test Node"}
            </button>

            {/* Webhook URL for trigger nodes */}
            {(node.data.type.includes("trigger") || node.data.type === "webhook") && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-900 mb-2">Webhook URL</div>
                <div className="bg-white p-2 rounded border text-xs font-mono break-all">
                  https://your-domain.com/webhook/{node.id}
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(`https://your-domain.com/webhook/${node.id}`)}
                  className="mt-2 text-xs text-green-700 hover:text-green-800"
                >
                  📋 Copy URL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
