import { Zap, Database, MessageSquare, FileText, GitBranch, Shuffle, Globe, Code } from "lucide-react"

export const NODE_CATEGORIES = {
  triggers: {
    label: "Triggers",
    icon: Zap,
    color: "#10b981",
    nodes: [
      {
        type: "webhook",
        label: "Webhook",
        icon: "🔗",
        description: "Trigger workflow via HTTP request",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          method: "POST",
          path: "/webhook",
          authentication: "none",
          responseMode: "onReceived",
        },
      },
      {
        type: "schedule",
        label: "Schedule",
        icon: "⏰",
        description: "Trigger workflow on schedule",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          rule: "0 9 * * 1-5",
          timezone: "America/New_York",
        },
      },
      {
        type: "email-trigger",
        label: "Email Trigger",
        icon: "📧",
        description: "Trigger on new email",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          provider: "gmail",
          folder: "INBOX",
          filters: {},
        },
      },
      {
        type: "telegram-trigger",
        label: "Telegram Trigger",
        icon: "✈️",
        description: "Trigger on Telegram messages",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          botToken: "",
          chatId: "",
          triggerOn: "message",
          commands: ["/start", "/help"],
          updates: ["message", "callback_query"],
        },
      },
      {
        type: "discord-trigger",
        label: "Discord Trigger",
        icon: "🎮",
        description: "Trigger on Discord events",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          botToken: "",
          guildId: "",
          channelId: "",
          triggerOn: "message",
          eventTypes: ["MESSAGE_CREATE", "MESSAGE_UPDATE", "REACTION_ADD"],
        },
      },
      {
        type: "whatsapp-trigger",
        label: "WhatsApp Trigger",
        icon: "💬",
        description: "Trigger on WhatsApp messages",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          apiKey: "",
          phoneNumber: "",
          webhookUrl: "",
          triggerOn: "message",
          messageTypes: ["text", "image", "document"],
        },
      },
      {
        type: "file-trigger",
        label: "File Trigger",
        icon: "📁",
        description: "Trigger on file changes",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          watchPath: "/uploads",
          event: "created",
        },
      },
      {
        type: "manual-trigger",
        label: "Manual Trigger",
        icon: "👆",
        description: "Start workflow manually",
        color: "#10b981",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {},
      },
    ],
  },
  data: {
    label: "Data & Storage",
    icon: Database,
    color: "#3b82f6",
    nodes: [
      {
        type: "postgres",
        label: "PostgreSQL",
        icon: "🐘",
        description: "Query PostgreSQL database",
        color: "#3b82f6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "select",
          table: "",
          columns: "*",
          where: "",
          limit: 100,
        },
      },
      {
        type: "mysql",
        label: "MySQL",
        icon: "🐬",
        description: "Query MySQL database",
        color: "#3b82f6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "select",
          query: "",
        },
      },
      {
        type: "mongodb",
        label: "MongoDB",
        icon: "🍃",
        description: "Query MongoDB",
        color: "#3b82f6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "find",
          collection: "",
          query: "{}",
        },
      },
      {
        type: "redis",
        label: "Redis",
        icon: "🔴",
        description: "Redis operations",
        color: "#3b82f6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "get",
          key: "",
        },
      },
      {
        type: "csv",
        label: "CSV",
        icon: "📊",
        description: "Read/Write CSV files",
        color: "#3b82f6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "read",
          filePath: "",
          delimiter: ",",
        },
      },
    ],
  },
  communication: {
    label: "Communication",
    icon: MessageSquare,
    color: "#8b5cf6",
    nodes: [
      {
        type: "email",
        label: "Email",
        icon: "📧",
        description: "Send emails",
        color: "#8b5cf6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          to: "",
          subject: "",
          body: "",
          attachments: [],
        },
      },
      {
        type: "slack",
        label: "Slack",
        icon: "💬",
        description: "Send Slack messages",
        color: "#8b5cf6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          channel: "",
          message: "",
          username: "n8n",
        },
      },
      {
        type: "discord",
        label: "Discord",
        icon: "🎮",
        description: "Send Discord messages",
        color: "#8b5cf6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          webhook: "",
          content: "",
        },
      },
      {
        type: "telegram",
        label: "Telegram",
        icon: "✈️",
        description: "Send Telegram messages",
        color: "#8b5cf6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          chatId: "",
          text: "",
        },
      },
      {
        type: "whatsapp",
        label: "WhatsApp",
        icon: "💬",
        description: "Send WhatsApp messages",
        color: "#8b5cf6",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          apiKey: "",
          phoneNumber: "",
          message: "",
          messageType: "text",
          mediaUrl: "",
        },
      },
    ],
  },
  productivity: {
    label: "Productivity",
    icon: FileText,
    color: "#f59e0b",
    nodes: [
      {
        type: "google-sheets",
        label: "Google Sheets",
        icon: "📊",
        description: "Read/Write Google Sheets",
        color: "#f59e0b",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "append",
          spreadsheetId: "",
          range: "A1:Z1000",
        },
      },
      {
        type: "notion",
        label: "Notion",
        icon: "📝",
        description: "Notion operations",
        color: "#f59e0b",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "create",
          databaseId: "",
        },
      },
      {
        type: "airtable",
        label: "Airtable",
        icon: "🗂️",
        description: "Airtable operations",
        color: "#f59e0b",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "list",
          baseId: "",
          tableId: "",
        },
      },
      {
        type: "google-drive",
        label: "Google Drive",
        icon: "💾",
        description: "Google Drive operations",
        color: "#f59e0b",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "upload",
          folderId: "",
        },
      },
      {
        type: "dropbox",
        label: "Dropbox",
        icon: "📦",
        description: "Dropbox operations",
        color: "#f59e0b",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "upload",
          path: "/",
        },
      },
    ],
  },
  logic: {
    label: "Logic & Flow",
    icon: GitBranch,
    color: "#ef4444",
    nodes: [
      {
        type: "if",
        label: "IF",
        icon: "🔀",
        description: "Conditional branching",
        color: "#ef4444",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right", "true", "false"],
        config: {
          conditions: [{ leftValue: "", operation: "equal", rightValue: "" }],
          combineOperation: "and",
        },
      },
      {
        type: "switch",
        label: "Switch",
        icon: "🎛️",
        description: "Multi-way branching",
        color: "#ef4444",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right", "0", "1", "2", "default"],
        config: {
          dataPropertyName: "",
          fallbackOutput: "default",
          rules: [],
        },
      },
      {
        type: "merge",
        label: "Merge",
        icon: "🔗",
        description: "Merge multiple inputs",
        color: "#ef4444",
        inputs: ["input-top", "input-left", "main1", "main2"],
        outputs: ["output-bottom", "output-right"],
        config: {
          mode: "append",
          clashHandling: "addSuffix",
        },
      },
      {
        type: "loop",
        label: "Loop Over Items",
        icon: "🔄",
        description: "Process items in a loop",
        color: "#ef4444",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          batchSize: 1,
        },
      },
      {
        type: "wait",
        label: "Wait",
        icon: "⏸️",
        description: "Wait for specified time",
        color: "#ef4444",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          amount: 1,
          unit: "seconds",
        },
      },
    ],
  },
  transform: {
    label: "Transform",
    icon: Shuffle,
    color: "#06b6d4",
    nodes: [
      {
        type: "set",
        label: "Set",
        icon: "✏️",
        description: "Set field values",
        color: "#06b6d4",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          keepOnlySet: false,
          values: {},
        },
      },
      {
        type: "function",
        label: "Function",
        icon: "⚡",
        description: "Execute JavaScript code",
        color: "#06b6d4",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          functionCode: "// Add your code here\nreturn items;",
        },
      },
      {
        type: "json",
        label: "JSON",
        icon: "📋",
        description: "Parse/Stringify JSON",
        color: "#06b6d4",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "parse",
          dataPropertyName: "data",
        },
      },
      {
        type: "xml",
        label: "XML",
        icon: "📄",
        description: "Parse/Generate XML",
        color: "#06b6d4",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          operation: "parse",
          dataPropertyName: "data",
        },
      },
      {
        type: "datetime",
        label: "Date & Time",
        icon: "📅",
        description: "Date/time operations",
        color: "#06b6d4",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          action: "format",
          format: "YYYY-MM-DD",
        },
      },
    ],
  },
  http: {
    label: "HTTP & APIs",
    icon: Globe,
    color: "#84cc16",
    nodes: [
      {
        type: "http-request",
        label: "HTTP Request",
        icon: "🌐",
        description: "Make HTTP requests",
        color: "#84cc16",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          method: "GET",
          url: "",
          headers: {},
          body: "",
        },
      },
      {
        type: "webhook-response",
        label: "Respond to Webhook",
        icon: "↩️",
        description: "Send response to webhook",
        color: "#84cc16",
        inputs: ["input-top", "input-left"],
        outputs: [],
        config: {
          statusCode: 200,
          body: "",
          headers: {},
        },
      },
      {
        type: "graphql",
        label: "GraphQL",
        icon: "◉",
        description: "Execute GraphQL queries",
        color: "#84cc16",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          endpoint: "",
          query: "",
          variables: {},
        },
      },
    ],
  },
  ai: {
    label: "AI & ML",
    icon: Code,
    color: "#a855f7",
    nodes: [
      {
        type: "ai-agent",
        label: "AI Agent",
        icon: "🤖",
        description: "Orchestrates tools to complete tasks",
        color: "#a855f7",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          systemMessage:
            "You are a helpful AI agent that selects and uses tools to complete tasks. Use the HTTP Request tool for web data, PostgreSQL for database queries, or LLM for text generation.",
          tools: ["http-request", "postgres", "llm"],
          memory: "simple",
          userInput: "",
        },
      },
      {
        type: "llm",
        label: "LLM",
        icon: "🧠",
        description: "Interact with Large Language Models",
        color: "#a855f7",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          apiKey: "",
          prompt: "",
        },
      },
      {
        type: "embedding",
        label: "Text Embedding",
        icon: "🔤",
        description: "Generate text embeddings",
        color: "#a855f7",
        inputs: ["input-top", "input-left"],
        outputs: ["output-bottom", "output-right"],
        config: {
          model: "text-embedding-ada-002",
          input: "",
        },
      },
    ],
  },
}

export interface NodeDefinition {
  category: string
  type: string
  description: string
  icon: string
  color: string
  defaultData: {
    label: string
    type: string
    icon: string
    description: string
    parameters: Record<string, any>
    config?: Record<string, any>
  }
}

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  const allNodes = Object.values(NODE_CATEGORIES).flatMap((category) => category.nodes)
  return allNodes.find((node) => node.type === type)
}

export function getNodesByCategory(categoryName: string): any[] {
  const category = Object.entries(NODE_CATEGORIES).find(([key, val]) => key === categoryName)
  return category ? category[1].nodes : []
}

export function getAllNodeTypes(): string[] {
  return Object.values(NODE_CATEGORIES).flatMap((category) => category.nodes.map((node) => node.type))
}
