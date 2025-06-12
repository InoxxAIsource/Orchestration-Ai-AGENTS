"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Available Nodes for Toolbox
const NODE_TYPES = [
  {
    type: "trigger",
    label: "Trigger",
    icon: "⚡",
    description: "Start your workflow",
    color: "#FF6B6B",
    category: "trigger",
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: "🌐",
    description: "Listen for web requests",
    color: "#4ECDC4",
    category: "trigger",
  },
  {
    type: "cron",
    label: "Schedule",
    icon: "⏰",
    description: "Run on a schedule",
    color: "#FFD166",
    category: "trigger",
  },
  {
    type: "action",
    label: "Action",
    icon: "🛠️",
    description: "Perform an action",
    color: "#06D6A0",
    category: "action",
  },
  {
    type: "condition",
    label: "Condition",
    icon: "❓",
    description: "Branch your workflow",
    color: "#118AB2",
    category: "logic",
  },
  {
    type: "api",
    label: "API Call",
    icon: "🔌",
    description: "Call an external API",
    color: "#073B4C",
    category: "action",
  },
  {
    type: "start",
    label: "Start",
    icon: "▶️",
    description: "Start of workflow",
    color: "#38b000",
    category: "logic",
  },
  {
    type: "end",
    label: "End",
    icon: "⏹️",
    description: "End of workflow",
    color: "#d90429",
    category: "logic",
  },
  {
    type: "decision",
    label: "Decision",
    icon: "🔀",
    description: "Branch based on conditions",
    color: "#f77f00",
    category: "logic",
  },
]

interface NodeToolboxProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

export default function NodeToolbox({ onDragStart }: NodeToolboxProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNodes = NODE_TYPES.filter(
    (node) =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Node Toolbox</h2>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search nodes..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trigger">Triggers</TabsTrigger>
          <TabsTrigger value="action">Actions</TabsTrigger>
          <TabsTrigger value="logic">Logic</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {filteredNodes.map((node) => (
            <div
              key={node.type}
              className="p-3 border rounded bg-white cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              style={{ borderLeftColor: node.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center">
                <span className="mr-2">{node.icon}</span>
                <span className="font-medium">{node.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{node.description}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="trigger" className="space-y-2">
          {filteredNodes
            .filter((node) => node.category === "trigger")
            .map((node) => (
              <div
                key={node.type}
                className="p-3 border rounded bg-white cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
                style={{ borderLeftColor: node.color, borderLeftWidth: "4px" }}
              >
                <div className="flex items-center">
                  <span className="mr-2">{node.icon}</span>
                  <span className="font-medium">{node.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{node.description}</p>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="action" className="space-y-2">
          {filteredNodes
            .filter((node) => node.category === "action")
            .map((node) => (
              <div
                key={node.type}
                className="p-3 border rounded bg-white cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
                style={{ borderLeftColor: node.color, borderLeftWidth: "4px" }}
              >
                <div className="flex items-center">
                  <span className="mr-2">{node.icon}</span>
                  <span className="font-medium">{node.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{node.description}</p>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="logic" className="space-y-2">
          {filteredNodes
            .filter((node) => node.category === "logic")
            .map((node) => (
              <div
                key={node.type}
                className="p-3 border rounded bg-white cursor-move hover:shadow-md transition-shadow"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
                style={{ borderLeftColor: node.color, borderLeftWidth: "4px" }}
              >
                <div className="flex items-center">
                  <span className="mr-2">{node.icon}</span>
                  <span className="font-medium">{node.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{node.description}</p>
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
