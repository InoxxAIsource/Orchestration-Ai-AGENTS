"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Pencil, Trash2, Copy, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function CustomNode({ id, data, isConnectable, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label)

  const handleRename = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value)
  }, [])

  const handleLabelSubmit = useCallback(() => {
    setIsEditing(false)
    if (data.onRename && label.trim() !== "") {
      data.onRename(id, label)
    }
  }, [id, label, data])

  const handleDelete = useCallback(() => {
    if (data.onDelete) {
      data.onDelete(id)
    }
  }, [id, data])

  const handleDuplicate = useCallback(() => {
    if (data.onDuplicate) {
      data.onDuplicate(id)
    }
  }, [id, data])

  const nodeColor = data.color || "#6B7280"

  return (
    <div
      className={`relative bg-white rounded-lg border-2 shadow-md p-4 min-w-[200px] max-w-[280px] transition-all duration-200 ${
        selected
          ? "ring-2 ring-blue-500 shadow-lg border-blue-500"
          : "border-gray-200 hover:shadow-lg hover:border-gray-300"
      }`}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: nodeColor }}
        isConnectable={isConnectable}
      />

      {/* Node Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg" style={{ color: nodeColor }}>
            {data.icon}
          </span>
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              onBlur={handleLabelSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleLabelSubmit()}
              className="text-sm font-medium border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span className="text-sm font-medium truncate">{label}</span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
              <MoreHorizontal size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRename}>
              <Pencil size={14} className="mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy size={14} className="mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
              <Trash2 size={14} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Node Content */}
      <div className="text-xs text-gray-500 mb-2">{data.description || "No description"}</div>

      {/* Node Type Badge */}
      <Badge variant="outline" className="text-xs" style={{ borderColor: nodeColor, color: nodeColor }}>
        {data.type}
      </Badge>

      {/* Parameter Preview */}
      {data.parameters && Object.keys(data.parameters).length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          {Object.entries(data.parameters)
            .slice(0, 2)
            .map(([key, value]) => (
              <div key={key} className="truncate">
                <span className="font-medium">{key}:</span>{" "}
                <span>
                  {typeof value === "string"
                    ? value.slice(0, 15)
                    : typeof value === "object"
                      ? "[Object]"
                      : String(value)}
                  {typeof value === "string" && value.length > 15 ? "..." : ""}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Status Indicator */}
      {data.status && (
        <div className="absolute top-2 right-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.status === "running"
                ? "bg-blue-500 animate-pulse"
                : data.status === "success"
                  ? "bg-green-500"
                  : data.status === "error"
                    ? "bg-red-500"
                    : "bg-gray-400"
            }`}
          ></div>
        </div>
      )}

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: nodeColor }}
        isConnectable={isConnectable}
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: nodeColor }}
        isConnectable={isConnectable}
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white"
        style={{ backgroundColor: nodeColor }}
        isConnectable={isConnectable}
      />
    </div>
  )
}
