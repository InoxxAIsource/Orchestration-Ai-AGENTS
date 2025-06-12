"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { getNodeDefinition } from "@/lib/node-definitions"

interface EnhancedNodeProps extends NodeProps {
  data: {
    label: string
    type: string
    icon: string
    description: string
    parameters: Record<string, any>
    status?: "idle" | "running" | "success" | "error" | "warning"
    color?: string
  }
}

export default function EnhancedNode({ data, selected }: EnhancedNodeProps) {
  const nodeDefinition = getNodeDefinition(data.type)
  const nodeColor = data.color || nodeDefinition?.color || "#6B7280"

  const getStatusIcon = () => {
    switch (data.status) {
      case "running":
        return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
      case "success":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "error":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "warning":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const getStatusBorder = () => {
    switch (data.status) {
      case "running":
        return "border-blue-500 shadow-blue-200"
      case "success":
        return "border-green-500 shadow-green-200"
      case "error":
        return "border-red-500 shadow-red-200"
      case "warning":
        return "border-yellow-500 shadow-yellow-200"
      default:
        return "border-gray-200"
    }
  }

  const hasInputs = !["webhook", "schedule", "event", "manual"].includes(data.type)
  const hasOutputs = !["httpResponse", "storage", "logger"].includes(data.type)

  return (
    <div
      className={`relative bg-white rounded-lg border-2 shadow-sm transition-all duration-200 min-w-[200px] max-w-[280px] ${
        selected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
      } ${getStatusBorder()}`}
    >
      {/* Input Handle */}
      {hasInputs && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 border-2 border-white"
          style={{ backgroundColor: nodeColor }}
        />
      )}

      {/* Node Header */}
      <div
        className="px-4 py-3 rounded-t-lg border-b"
        style={{ backgroundColor: `${nodeColor}15`, borderColor: `${nodeColor}30` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{data.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 truncate">{data.label}</h3>
              <p className="text-xs text-gray-500 truncate">{data.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{getStatusIcon()}</div>
        </div>
      </div>

      {/* Node Body */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs" style={{ borderColor: nodeColor, color: nodeColor }}>
            {data.type}
          </Badge>

          {/* Parameter indicators */}
          {Object.keys(data.parameters || {}).length > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Quick parameter preview */}
        {data.parameters && (
          <div className="mt-2 space-y-1">
            {Object.entries(data.parameters)
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key} className="text-xs text-gray-600">
                  <span className="font-medium">{key}:</span>{" "}
                  <span className="truncate">
                    {typeof value === "string" ? value.slice(0, 20) : JSON.stringify(value).slice(0, 20)}
                    {(typeof value === "string" ? value.length : JSON.stringify(value).length) > 20 && "..."}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Output Handles */}
      {hasOutputs && (
        <>
          {data.type === "ifElse" ? (
            <>
              <Handle
                type="source"
                position={Position.Right}
                id="true"
                className="w-3 h-3 border-2 border-white"
                style={{ backgroundColor: "#10B981", top: "40%" }}
              />
              <Handle
                type="source"
                position={Position.Right}
                id="false"
                className="w-3 h-3 border-2 border-white"
                style={{ backgroundColor: "#EF4444", top: "60%" }}
              />
            </>
          ) : data.type === "switch" ? (
            <>
              {(data.parameters?.cases || []).map((_: any, index: number) => (
                <Handle
                  key={index}
                  type="source"
                  position={Position.Right}
                  id={`case-${index}`}
                  className="w-3 h-3 border-2 border-white"
                  style={{
                    backgroundColor: nodeColor,
                    top: `${30 + index * 20}%`,
                  }}
                />
              ))}
              <Handle
                type="source"
                position={Position.Bottom}
                id="default"
                className="w-3 h-3 border-2 border-white"
                style={{ backgroundColor: "#6B7280" }}
              />
            </>
          ) : (
            <Handle
              type="source"
              position={Position.Right}
              className="w-3 h-3 border-2 border-white"
              style={{ backgroundColor: nodeColor }}
            />
          )}
        </>
      )}

      {/* Selection indicator */}
      {selected && <div className="absolute -inset-1 bg-blue-500 rounded-lg opacity-20 pointer-events-none" />}
    </div>
  )
}
