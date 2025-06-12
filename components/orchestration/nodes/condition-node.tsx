"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"

export default function ConditionNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`p-3 rounded-lg border-2 shadow-sm ${selected ? "border-blue-500" : "border-gray-200"}`}
      style={{ backgroundColor: data.color || "#118AB2", minWidth: "200px" }}
    >
      <div className="flex items-center">
        <span className="text-lg mr-2">{data.icon || "❓"}</span>
        <span className="font-bold text-white">{data.label}</span>
      </div>
      <p className="text-xs text-white opacity-80 mt-1">{data.description}</p>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white border-2 border-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-white border-2 border-blue-500" id="true" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-blue-500"
        id="false"
      />
    </div>
  )
}
