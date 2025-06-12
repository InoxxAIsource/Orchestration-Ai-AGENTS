export type NodeType =
  | "trigger"
  | "action"
  | "condition"
  | "webhook"
  | "cron"
  | "api"
  | "data"
  | "output"
  | "start"
  | "end"
  | "decision"
  | "agentNode"

export type NodeData = {
  label: string
  type: NodeType
  icon?: string
  description?: string
  parameters?: Record<string, any>
  color?: string
  agentId?: string
  agent?: any
  config?: NodeConfig
  status?: "idle" | "running" | "success" | "error" | "warning"
}

export type NodeConfig = {
  parameters?: Record<string, any>
  conditions?: string[]
  retryPolicy?: {
    maxAttempts: number
    backoffFactor: number
  }
  timeout?: number
  description?: string
}

export type FlowNodeType = {
  id: string
  type: string
  data: NodeData
  position: { x: number; y: number }
  width?: number
  height?: number
  selected?: boolean
  dragging?: boolean
}

export type EdgeType = {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  label?: string
  animated?: boolean
  condition?: string
  type?: string
}

export type ProjectType = {
  id: string
  name: string
  description: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export type OrchestrationVersion = {
  version: string
  createdAt: string
  createdBy: string
  notes: string
  snapshot: {
    nodes: FlowNodeType[]
    edges: EdgeType[]
    variables: Record<string, any>
  }
}

export type Orchestration = {
  id: string
  projectId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  tags: string[]
  nodes: FlowNodeType[]
  edges: EdgeType[]
  variables: Record<string, any>
  versions: OrchestrationVersion[]
  currentVersion: string
  isPublic: boolean
  status: "draft" | "published" | "archived"
}

export type TestResult = {
  nodeId: string
  status: "success" | "error" | "warning"
  message: string
  details?: any
  executionTime?: number
}

export type CollaboratorType = {
  id: string
  name: string
  email?: string
  cursor?: { x: number; y: number }
  lastSeen: string
  isActive: boolean
}

export const OrchestrationSchema = {
  name: { required: true, minLength: 2, maxLength: 50 },
  description: { maxLength: 500 },
  nodes: { required: true, minLength: 1 },
  projectId: { required: true },
}
