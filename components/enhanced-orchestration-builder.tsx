"use client"

import { useCallback, useState, useRef, useEffect } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  Save,
  Undo,
  Redo,
  Maximize,
  ZoomIn,
  ZoomOut,
  Play,
  Square,
  Settings,
  Search,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Zap,
  Database,
  Globe,
  MessageSquare,
  FileText,
  Code,
  Shuffle,
  GitBranch,
  AlertTriangle,
} from "lucide-react"

// Enhanced Node Types with comprehensive categories
const NODE_CATEGORIES = {
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
          conditions: [
            {
              leftValue: "",
              operation: "equal",
              rightValue: "",
            },
          ],
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

// Enhanced Node Component with 4 connectors and proper React Flow integration
const EnhancedNode = ({ data, selected, id }) => {
  const [isExecuting, setIsExecuting] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <>
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-top"
        className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500"
        style={{ top: -6, left: "50%", transform: "translateX(-50%)" }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        id="output-bottom"
        className="w-3 h-3 border-2 border-white bg-blue-500 hover:bg-blue-600"
        style={{ bottom: -6, left: "50%", transform: "translateX(-50%)" }}
      />

      <Handle
        type="target"
        position={Position.Left}
        id="input-left"
        className="w-3 h-3 border-2 border-white bg-gray-400 hover:bg-gray-500"
        style={{ left: -6, top: "50%", transform: "translateY(-50%)" }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="output-right"
        className="w-3 h-3 border-2 border-white bg-blue-500 hover:bg-blue-600"
        style={{ right: -6, top: "50%", transform: "translateY(-50%)" }}
      />

      <div
        className={`
        relative bg-white border-2 shadow-sm rounded-lg min-w-[200px] transition-all duration-200
        ${selected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"}
        ${isExecuting ? "animate-pulse" : ""}
        ${hasError ? "border-red-500" : ""}
      `}
      >
        {/* Node Header */}
        <div
          className="px-3 py-2 border-b border-gray-100 flex items-center gap-2"
          style={{ borderLeftColor: data?.color || "#6B7280", borderLeftWidth: "4px" }}
        >
          <span className="text-lg">{data?.icon || "📦"}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 truncate">{data?.label || "Node"}</div>
            {data?.description && <div className="text-xs text-gray-500 truncate">{data.description}</div>}
          </div>
          {isExecuting && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          {hasError && <AlertTriangle className="w-4 h-4 text-red-500" />}
        </div>

        {/* Node Body */}
        <div className="px-3 py-2">
          {/* Connection Status Indicators */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" title="Input connected" />
              <span className="text-xs text-gray-500">In</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Out</span>
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="Output connected" />
            </div>
          </div>

          {/* Node Configuration Preview */}
          {data?.config && Object.keys(data.config).length > 0 && (
            <div className="text-xs text-gray-600 space-y-1">
              {Object.entries(data.config)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium capitalize">{key}:</span>
                    <span className="truncate ml-2 max-w-[100px]">
                      {typeof value === "string" ? value || "Not set" : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              {Object.keys(data.config).length > 2 && (
                <div className="text-gray-400 text-center">+{Object.keys(data.config).length - 2} more...</div>
              )}
            </div>
          )}
        </div>

        {/* Execution Status */}
        {(isExecuting || hasError) && (
          <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 text-xs">
            {isExecuting && <span className="text-blue-600">Executing...</span>}
            {hasError && <span className="text-red-600">Error occurred</span>}
          </div>
        )}
      </div>
    </>
  )
}

// Node Configuration Panel with enhanced messaging configs
const NodeConfigPanel = ({ node, onClose, onUpdate, onDelete, onDuplicate }) => {
  const [config, setConfig] = useState(node?.data?.config || {})
  const [activeTab, setActiveTab] = useState("config")

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)

    // Update node in real-time
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        config: newConfig,
      },
    }
    onUpdate(updatedNode)
  }

  const renderConfigField = (key, value, type = "text") => {
    switch (type) {
      case "select":
        const options = getSelectOptions(key, node.data.type)
        return (
          <select
            value={value}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case "multiselect":
        const multiOptions = getSelectOptions(key, node.data.type)
        return (
          <div className="space-y-1">
            {multiOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentArray = Array.isArray(value) ? value : []
                    const newArray = e.target.checked
                      ? [...currentArray, option.value]
                      : currentArray.filter((v) => v !== option.value)
                    handleConfigChange(key, newArray)
                  }}
                  className="rounded"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )
      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-none"
            placeholder={`Enter ${key}...`}
          />
        )
      case "code":
        return (
          <textarea
            value={value || ""}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm font-mono h-32 resize-none bg-gray-50"
            placeholder="// Enter your code here..."
          />
        )
      case "json":
        return (
          <textarea
            value={typeof value === "object" ? JSON.stringify(value, null, 2) : value || "{}"}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleConfigChange(key, parsed)
              } catch {
                // Invalid JSON, keep as string for now
              }
            }}
            className="w-full p-2 border border-gray-300 rounded text-sm font-mono h-24 resize-none bg-gray-50"
            placeholder="{}"
          />
        )
      case "password":
        return (
          <input
            type="password"
            value={value || ""}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder={`Enter ${key}...`}
          />
        )
      default:
        return (
          <input
            type={type}
            value={value || ""}
            onChange={(e) => handleConfigChange(key, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder={`Enter ${key}...`}
          />
        )
    }
  }

  // Get select options based on field and node type
  const getSelectOptions = (key, nodeType) => {
    const options = {
      method: [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
        { value: "PATCH", label: "PATCH" },
      ],
      provider: [
        { value: "openai", label: "OpenAI" },
        { value: "anthropic", label: "Anthropic" },
        { value: "custom", label: "Custom" },
      ],
      memory: [
        { value: "simple", label: "Simple Memory" },
        { value: "none", label: "No Memory" },
      ],
      tools: [
        { value: "http-request", label: "HTTP Request" },
        { value: "postgres", label: "PostgreSQL" },
        { value: "llm", label: "LLM" },
        { value: "email", label: "Email" },
        { value: "slack", label: "Slack" },
      ],
    }
    return options[key] || []
  }

  const getFieldType = (key, value) => {
    if (key.includes("token") || key.includes("key") || key.includes("secret") || key === "apiKey") return "password"
    if (key.includes("code") || key === "functionCode") return "code"
    if (
      key.includes("query") ||
      key.includes("body") ||
      key.includes("message") ||
      key === "systemMessage" ||
      key === "prompt"
    )
      return "textarea"
    if (key.includes("headers") || key.includes("variables") || key.includes("filters")) return "json"
    if (key === "method" || key === "provider" || key === "memory") return "select"
    if (key === "tools") return "multiselect"
    return "text"
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <span className="text-xl">{node.data.icon}</span>
            {node.data.label}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            ✕
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onDuplicate(node)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
          >
            <Copy className="w-3 h-3" />
            Duplicate
          </button>
          <button
            onClick={() => onDelete(node.id)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded">
            <Play className="w-3 h-3" />
            Test
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["config", "data", "execution"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize ${
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
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">{node.data.description}</div>

            {Object.entries(config).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                  {(key.includes("token") || key.includes("key") || key === "systemMessage" || key === "tools") && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderConfigField(key, value, getFieldType(key, value))}
                {key.includes("token") && (
                  <div className="text-xs text-gray-500 mt-1">🔒 This field is encrypted and secure</div>
                )}
              </div>
            ))}

            {Object.keys(config).length === 0 && (
              <div className="text-sm text-gray-500 italic">No configuration options available for this node.</div>
            )}
          </div>
        )}

        {activeTab === "data" && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Input Data</div>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <pre>{JSON.stringify(node.data.inputData || {}, null, 2)}</pre>
            </div>

            <div className="text-sm font-medium text-gray-700">Output Data</div>
            <div className="bg-gray-50 p-3 rounded text-xs font-mono">
              <pre>{JSON.stringify(node.data.outputData || {}, null, 2)}</pre>
            </div>
          </div>
        )}

        {activeTab === "execution" && (
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700">Execution Info</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Run:</span>
                <span className="font-medium">Never</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Executions:</span>
                <span className="font-medium">0</span>
              </div>
            </div>

            <button className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              Test Node
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Enhanced Node Palette
const NodePalette = ({ onDragStart, searchTerm, selectedCategory }) => {
  const filteredCategories = Object.entries(NODE_CATEGORIES).filter(([key, category]) => {
    if (selectedCategory && selectedCategory !== key) return false
    if (!searchTerm) return true

    return (
      category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.nodes.some(
        (node) =>
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    )
  })

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredCategories.map(([categoryKey, category]) => (
        <div key={categoryKey} className="mb-4">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <category.icon className="w-4 h-4" style={{ color: category.color }} />
            <span className="font-medium text-sm">{category.label}</span>
            <span className="text-xs text-gray-500 ml-auto">{category.nodes.length}</span>
          </div>

          <div className="p-2 space-y-1">
            {category.nodes
              .filter(
                (node) =>
                  !searchTerm ||
                  node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  node.description.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((node) => (
                <div
                  key={node.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, node)}
                  className="p-2 border border-gray-200 rounded cursor-grab hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{node.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{node.label}</div>
                      <div className="text-xs text-gray-500 truncate">{node.description}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Main Component
export default function EnhancedOrchestrationBuilder() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showMinimap, setShowMinimap] = useState(true)

  const nodeTypes = {
    enhanced: EnhancedNode,
  }

  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      try {
        if (!reactFlowWrapper.current) return

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const nodeDataString = event.dataTransfer.getData("application/reactflow")

        if (!nodeDataString) return

        const nodeData = JSON.parse(nodeDataString)
        if (!nodeData || !nodeData.type) return

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        }

        const newNode = {
          id: `${nodeData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "enhanced",
          position,
          data: {
            ...nodeData,
            inputData: {},
            outputData: {},
          },
          width: undefined,
          height: undefined,
          selected: false,
          dragging: false,
          dragHandle: undefined,
          selectable: true,
          connectable: true,
          deletable: true,
          parentId: undefined,
          extent: undefined,
          expandParent: undefined,
          positionAbsolute: undefined,
          zIndex: undefined,
          ariaLabel: undefined,
          focusable: true,
          resizing: false,
          style: undefined,
          className: undefined,
          sourcePosition: undefined,
          targetPosition: undefined,
          hidden: false,
          measured: undefined,
        }

        setNodes((nds) => [...nds, newNode])
      } catch (error) {
        console.error("Failed to add node:", error)
      }
    },
    [setNodes],
  )

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const handleNodeUpdate = useCallback(
    (updatedNode) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)))
    },
    [setNodes],
  )

  const handleNodeDelete = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
      setSelectedNode(null)
    },
    [setNodes, setEdges],
  )

  const handleNodeDuplicate = useCallback(
    (node) => {
      const duplicatedNode = {
        ...node,
        id: `${node.data.type}-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      }
      setNodes((nds) => [...nds, duplicatedNode])
    },
    [setNodes],
  )

  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true)
    // Simulate workflow execution
    setTimeout(() => {
      setIsExecuting(false)
    }, 3000)
  }, [])

  const stopExecution = useCallback(() => {
    setIsExecuting(false)
  }, [])

  // Remove any global error handlers that might interfere
  useEffect(() => {
    // Suppress MetaMask-related errors
    const originalError = console.error
    console.error = (...args) => {
      if (args[0]?.toString().includes("MetaMask") || args[0]?.toString().includes("ChromeTransport")) {
        return // Suppress MetaMask errors
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Node Palette */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Workflow Builder
            </h2>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded ${
                  !selectedCategory ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {Object.entries(NODE_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedCategory === key
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Node Categories */}
          <NodePalette onDragStart={onDragStart} searchTerm={searchTerm} selectedCategory={selectedCategory} />
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={(_, node) => setSelectedNode(node)}
            fitView
            connectionLineType="smoothstep"
            connectionLineStyle={{
              stroke: "#3b82f6",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#3b82f6", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#3b82f6",
              },
            }}
            snapToGrid={true}
            snapGrid={[15, 15]}
          >
            {/* Top Panel - Execution Controls */}
            <Panel
              position="top-center"
              className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={executeWorkflow}
                disabled={isExecuting || nodes.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium ${
                  isExecuting
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute
                  </>
                )}
              </button>

              {isExecuting && (
                <button
                  onClick={stopExecution}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-medium"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <button className="p-2 hover:bg-gray-100 rounded" title="Save Workflow">
                <Save className="w-4 h-4" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded" title="Workflow Settings">
                <Settings className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-2" />

              <span className="text-sm text-gray-600">
                {nodes.length} nodes, {edges.length} connections
              </span>
            </Panel>

            {/* Top Right Panel - View Controls */}
            <Panel position="top-right" className="flex flex-col gap-2">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Fit View">
                  <Maximize className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMinimap(!showMinimap)}
                  className={`p-2 rounded ${showMinimap ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
                  title="Toggle Minimap"
                >
                  {showMinimap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded" title="Undo">
                  <Undo className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Redo">
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </Panel>

            {/* Execution Status Panel */}
            {isExecuting && (
              <Panel position="bottom-center" className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <div className="font-medium text-sm">Executing Workflow</div>
                    <div className="text-xs text-gray-600">Processing nodes...</div>
                  </div>
                  <div className="ml-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/3 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {/* Connection Guide Panel */}
            {nodes.length > 0 && (
              <Panel
                position="bottom-left"
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-xs"
              >
                <div className="text-sm font-medium text-gray-900 mb-2">Connection Guide</div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Gray dots: Inputs (top/left)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Blue dots: Outputs (bottom/right)</span>
                  </div>
                  <div className="text-gray-500 italic">Drag from output to input to connect nodes</div>
                </div>
              </Panel>
            )}

            {showMinimap && <MiniMap className="bg-white" nodeColor="#e2e8f0" />}
            <Controls className="bg-white" />
            <Background color="#f1f5f9" gap={20} />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Node Configuration */}
        {selectedNode && (
          <div className="w-96 bg-white border-l border-gray-200">
            <NodeConfigPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={handleNodeUpdate}
              onDelete={handleNodeDelete}
              onDuplicate={handleNodeDuplicate}
            />
          </div>
        )}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
              <p className="text-gray-600 max-w-sm">
                Drag and drop nodes from the left panel to create your automation workflow. Connect nodes to define the
                flow of data and execution.
              </p>
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
