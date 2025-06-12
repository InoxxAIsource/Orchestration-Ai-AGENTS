"use client"

import type { NodeProps } from "@xyflow/react"
import { Handle, Position } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Play, Square, GitBranch, Bot, Zap, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"

function getStatusIcon(status?: string) {
  switch (status) {
    case "success":
      return <CheckCircle className="h-3 w-3 text-green-600" />
    case "error":
      return <XCircle className="h-3 w-3 text-red-600" />
    case "warning":
      return <AlertTriangle className="h-3 w-3 text-yellow-600" />
    case "running":
      return <Clock className="h-3 w-3 text-blue-600 animate-spin" />
    default:
      return null
  }
}

function getStatusColor(status?: string) {
  switch (status) {
    case "success":
      return "border-green-200 bg-green-50"
    case "error":
      return "border-red-200 bg-red-50"
    case "warning":
      return "border-yellow-200 bg-yellow-50"
    case "running":
      return "border-blue-200 bg-blue-50"
    default:
      return ""
  }
}

export function AgentNode({ data, selected }: NodeProps) {
  const statusColor = getStatusColor(data.status)
  const statusIcon = getStatusIcon(data.status)

  return (
    <Card
      className={`px-4 py-3 shadow-md min-w-[180px] transition-all ${statusColor} ${
        selected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <div className="font-semibold text-sm flex-1">{data.label}</div>
          {statusIcon}
        </div>

        {data.agent?.model && <div className="text-xs text-gray-500">{data.agent.model}</div>}

        {data.config?.description && <div className="text-xs text-gray-600 italic">{data.config.description}</div>}

        {data.agent?.tools && data.agent.tools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.agent.tools.slice(0, 2).map((tool: string) => (
              <Badge key={tool} variant="secondary" className="text-xs">
                {tool.replace("Tool", "")}
              </Badge>
            ))}
            {data.agent.tools.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{data.agent.tools.length - 2}
              </Badge>
            )}
          </div>
        )}

        {data.config?.retryPolicy && (
          <div className="text-xs text-gray-500">Retries: {data.config.retryPolicy.maxAttempts}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400" />
    </Card>
  )
}

export function StartNode({ data, selected }: NodeProps) {
  const statusColor = getStatusColor(data.status)
  const statusIcon = getStatusIcon(data.status)

  return (
    <Card
      className={`px-4 py-3 shadow-md min-w-[120px] transition-all bg-green-50 border-green-200 ${statusColor} ${
        selected ? "ring-2 ring-green-500 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-center gap-2 justify-center">
        <Play className="h-4 w-4 text-green-600" />
        <div className="font-semibold text-sm text-green-800">{data.label}</div>
        {statusIcon}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-500" />
    </Card>
  )
}

export function EndNode({ data, selected }: NodeProps) {
  const statusColor = getStatusColor(data.status)
  const statusIcon = getStatusIcon(data.status)

  return (
    <Card
      className={`px-4 py-3 shadow-md min-w-[120px] transition-all bg-red-50 border-red-200 ${statusColor} ${
        selected ? "ring-2 ring-red-500 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-red-500" />
      <div className="flex items-center gap-2 justify-center">
        <Square className="h-4 w-4 text-red-600" />
        <div className="font-semibold text-sm text-red-800">{data.label}</div>
        {statusIcon}
      </div>
    </Card>
  )
}

export function DecisionNode({ data, selected }: NodeProps) {
  const statusColor = getStatusColor(data.status)
  const statusIcon = getStatusIcon(data.status)

  return (
    <Card
      className={`px-4 py-3 shadow-md min-w-[140px] transition-all bg-yellow-50 border-yellow-200 ${statusColor} ${
        selected ? "ring-2 ring-yellow-500 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-500" />

      <div className="space-y-2">
        <div className="flex items-center gap-2 justify-center">
          <GitBranch className="h-4 w-4 text-yellow-600" />
          <div className="font-semibold text-sm text-yellow-800">{data.label}</div>
          {statusIcon}
        </div>

        {data.config?.conditions && data.config.conditions.length > 0 && (
          <div className="text-xs text-yellow-700">{data.config.conditions.length} condition(s)</div>
        )}
      </div>

      {/* Multiple output handles for branching */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        className="w-3 h-3 !bg-yellow-500"
        style={{ left: "30%" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="w-3 h-3 !bg-yellow-500"
        style={{ left: "70%" }}
      />
    </Card>
  )
}

export function TriggerNode({ data, selected }: NodeProps) {
  const statusColor = getStatusColor(data.status)
  const statusIcon = getStatusIcon(data.status)

  return (
    <Card
      className={`px-4 py-3 shadow-md min-w-[140px] transition-all bg-purple-50 border-purple-200 ${statusColor} ${
        selected ? "ring-2 ring-purple-500 shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2 justify-center">
          <Zap className="h-4 w-4 text-purple-600" />
          <div className="font-semibold text-sm text-purple-800">{data.label}</div>
          {statusIcon}
        </div>

        {data.config?.description && <div className="text-xs text-purple-700">{data.config.description}</div>}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
    </Card>
  )
}
