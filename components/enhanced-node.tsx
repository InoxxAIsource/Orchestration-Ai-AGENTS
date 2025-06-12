"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { AlertTriangle, Edit3, Trash2, Settings, Play } from "lucide-react"

export default function EnhancedNode({ id, data, selected }: NodeProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [hasError, setHasError] = useState(false)
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
    // Update node in parent component via custom event
    window.dispatchEvent(
      new CustomEvent("updateNode", {
        detail: { id, data: { ...data, label } },
      }),
    )
  }, [id, data, label])

  const handleDelete = useCallback(() => {
    window.dispatchEvent(new CustomEvent("deleteNode", { detail: { id } }))
  }, [id])

  const handleEdit = useCallback(() => {
    window.dispatchEvent(new CustomEvent("editNode", { detail: { id } }))
  }, [id])

  const handleExecute = useCallback(async () => {
    setIsExecuting(true)
    setHasError(false)

    try {
      // Simulate execution with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful execution result
      const mockResult = {
        success: true,
        timestamp: new Date().toISOString(),
        outputData: {
          result: `Executed ${data.label} successfully`,
          executionId: `exec_${Date.now()}`,
          status: "completed",
        },
      }

      // Update node with execution result
      window.dispatchEvent(
        new CustomEvent("updateNode", {
          detail: {
            id,
            data: {
              ...data,
              outputData: mockResult.outputData,
              lastRun: mockResult.timestamp,
              executions: (data.executions || 0) + 1,
            },
          },
        }),
      )
    } catch (error) {
      console.error("Execution failed:", error)
      setHasError(true)
    } finally {
      setIsExecuting(false)
    }
  }, [id, data])

  return (
    <div
      className={`
        relative bg-white border-2 shadow-sm rounded-lg min-w-[200px] transition-all duration-200
        ${selected ? "border-blue-500 shadow-lg" : "border-gray-200 hover:border-gray-300"}
        ${isExecuting ? "animate-pulse" : ""}
        ${hasError ? "border-red-500" : ""}
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="input-top"
        className="w-3 h-3 bg-gray-400 border-2 border-gray-500 rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-bottom"
        className="w-3 h-3 bg-blue-500 border-2 border-blue-600 rounded-full"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="input-left"
        className="w-3 h-3 bg-gray-400 border-2 border-gray-500 rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-right"
        className="w-3 h-3 bg-blue-500 border-2 border-blue-600 rounded-full"
      />

      <div
        className="px-3 py-2 border-b border-gray-100 flex items-center gap-2"
        style={{ borderLeftColor: data.color, borderLeftWidth: "4px" }}
      >
        <span className="text-lg">{data.icon}</span>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={handleLabelChange}
              onBlur={handleLabelSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleLabelSubmit()}
              className="text-sm font-medium border rounded px-2 py-1 w-full"
              autoFocus
            />
          ) : (
            <div className="font-medium text-sm text-gray-900 truncate">{label}</div>
          )}
          {data.description && <div className="text-xs text-gray-500 truncate">{data.description}</div>}
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleExecute}
            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="Execute Node"
            disabled={isExecuting}
          >
            <Play size={12} />
          </button>
          <button
            onClick={handleRename}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
            title="Rename Node"
          >
            <Edit3 size={12} />
          </button>
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
            title="Edit Node"
          >
            <Settings size={12} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete Node"
          >
            <Trash2 size={12} />
          </button>
        </div>
        {isExecuting && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
        {hasError && <AlertTriangle className="w-4 h-4 text-red-500" />}
      </div>

      <div className="px-3 py-2 group">
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
        {data.config && Object.keys(data.config).length > 0 && (
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

      {(isExecuting || hasError) && (
        <div className="px-3 py-1 bg-gray-50 border-t border-gray-100 text-xs">
          {isExecuting && <span className="text-blue-600">Executing...</span>}
          {hasError && <span className="text-red-600">Error occurred</span>}
        </div>
      )}

      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 bg-black text-white text-xs px-2 py-1 rounded">
          Input
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 bg-black text-white text-xs px-2 py-1 rounded">
          Output
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded">
          Alt Input
        </div>
        <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded">
          Alt Output
        </div>
      </div>
    </div>
  )
}
