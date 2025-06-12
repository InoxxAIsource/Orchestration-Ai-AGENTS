import { z } from "zod"

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
  model: z.enum(["gpt-4o", "gpt-4-turbo", "claude-3-opus", "mistral-large"]),
  temperature: z.number().min(0).max(1).default(0.7),
  systemPrompt: z.string().max(2000, "System prompt must be less than 2000 characters"),
  tools: z.array(z.string()).default([]),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export type Agent = z.infer<typeof AgentSchema>

export const AgentFormSchema = AgentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type AgentFormData = z.infer<typeof AgentFormSchema>

// Constants with metadata
export const MODELS = [
  { id: "gpt-4o", name: "GPT-4 Omni" },
  { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
  { id: "claude-3-opus", name: "Claude 3 Opus" },
  { id: "mistral-large", name: "Mistral Large" },
] as const

export type ToolConfig = {
  rateLimit?: number
  authType?: "api_key" | "oauth" | "none"
  requiresSetup?: boolean
  icon?: string
  category: "communication" | "data" | "productivity" | "web" | "code" | "blockchain" | "ai"
  disabled?: boolean
}

export const TOOLS = [
  // Web Tools
  {
    id: "WebSearchTool",
    name: "Web Search",
    description: "Perform live web searches using SERP API",
    config: {
      rateLimit: 10,
      authType: "api_key",
      category: "web",
    },
  },
  {
    id: "ScraperTool",
    name: "Web Scraper",
    description: "Extract content from websites with CSS selectors",
    config: {
      rateLimit: 5,
      category: "web",
    },
  },
  {
    id: "BrowserTool",
    name: "Headless Browser",
    description: "Full browser automation with Puppeteer/Playwright",
    config: {
      rateLimit: 3,
      category: "web",
    },
  },

  // Communication Tools
  {
    id: "TwitterTool",
    name: "Twitter/X API",
    description: "Read/write tweets, manage accounts, analyze trends",
    config: {
      rateLimit: 15,
      authType: "oauth",
      requiresSetup: true,
      category: "communication",
    },
  },
  {
    id: "SlackIntegration",
    name: "Slack",
    description: "Send messages, files, and interact with Slack workflows",
    config: {
      authType: "oauth",
      requiresSetup: true,
      category: "communication",
    },
  },
  {
    id: "TelegramBot",
    name: "Telegram Bot",
    description: "Send/receive messages via Telegram bot API",
    config: {
      authType: "api_key",
      category: "communication",
    },
  },
  {
    id: "EmailSender",
    name: "Email",
    description: "Send emails via SMTP or API services",
    config: {
      rateLimit: 20,
      authType: "api_key",
      category: "communication",
    },
  },

  // Code & Dev Tools
  {
    id: "CodeExecutor",
    name: "Code Runner",
    description: "Execute code snippets in multiple languages",
    config: {
      rateLimit: 5,
      category: "code",
    },
  },
  {
    id: "PythonExecutor",
    name: "Python Sandbox",
    description: "Run Python with limited libraries in secure env",
    config: {
      rateLimit: 3,
      category: "code",
    },
  },
  {
    id: "APICallerTool",
    name: "API Caller",
    description: "Make HTTP requests to any API endpoint",
    config: {
      rateLimit: 30,
      category: "code",
    },
  },
  {
    id: "WebhookCaller",
    name: "Webhooks",
    description: "Trigger and receive webhook calls",
    config: {
      category: "code",
    },
  },

  // Blockchain - Disabled by default to prevent MetaMask errors
  {
    id: "SolidityAuditor",
    name: "Solidity Auditor",
    description: "Analyze and audit Solidity smart contracts",
    config: {
      category: "blockchain",
      disabled: true, // Disabled to prevent MetaMask connection attempts
    },
  },

  // Data & AI
  {
    id: "SQLQueryTool",
    name: "SQL Query",
    description: "Run queries on connected databases",
    config: {
      authType: "api_key",
      requiresSetup: true,
      category: "data",
    },
  },
  {
    id: "VectorDBTool",
    name: "Vector Database",
    description: "Store/query embeddings from vector databases",
    config: {
      authType: "api_key",
      requiresSetup: true,
      category: "ai",
    },
  },
  {
    id: "DataVisualizer",
    name: "Data Visualizer",
    description: "Generate charts and data visualizations",
    config: {
      category: "data",
    },
  },

  // Productivity
  {
    id: "PDFGenerator",
    name: "PDF Generator",
    description: "Create PDFs from HTML or templates",
    config: {
      rateLimit: 10,
      category: "productivity",
    },
  },
  {
    id: "NotionConnector",
    name: "Notion",
    description: "Read/write Notion pages and databases",
    config: {
      authType: "oauth",
      requiresSetup: true,
      category: "productivity",
    },
  },
  {
    id: "FileUploader",
    name: "File Uploader",
    description: "Upload/download files from cloud storage",
    config: {
      authType: "oauth",
      requiresSetup: true,
      category: "productivity",
    },
  },

  // New additions
  {
    id: "CalendarTool",
    name: "Calendar",
    description: "Manage Google/Outlook calendar events",
    config: {
      authType: "oauth",
      requiresSetup: true,
      category: "productivity",
    },
  },
  {
    id: "CRMTool",
    name: "CRM Integrator",
    description: "Connect with Salesforce/Hubspot APIs",
    config: {
      authType: "oauth",
      requiresSetup: true,
      category: "productivity",
    },
  },
  {
    id: "ETLTool",
    name: "ETL Pipeline",
    description: "Simple extract-transform-load operations",
    config: {
      category: "data",
    },
  },
]
