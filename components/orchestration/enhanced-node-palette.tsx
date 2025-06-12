"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Search, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NODE_CATEGORIES, type NodeDefinition } from "@/lib/node-definitions"

interface EnhancedNodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeDefinition: NodeDefinition) => void
}

export default function EnhancedNodePalette({ onDragStart }: EnhancedNodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = useCallback((categoryName: string) => {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName)
      } else {
        newSet.add(categoryName)
      }
      return newSet
    })
  }, [])

  const filteredCategories = NODE_CATEGORIES.map((category) => ({
    ...category,
    nodes: category.nodes.filter(
      (node) =>
        node.defaultData.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.type.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  })).filter((category) => category.nodes.length > 0)

  const totalNodes = filteredCategories.reduce((sum, category) => sum + category.nodes.length, 0)

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Node Palette</h2>
          <Badge variant="secondary" className="text-xs">
            {totalNodes} nodes
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search nodes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-2">
        {filteredCategories.map((category) => {
          const isCollapsed = collapsedCategories.has(category.name)
          const nodeCount = category.nodes.length

          return (
            <div key={category.name} className="mb-4">
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 mr-2 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                  )}
                  <span className="mr-2" style={{ color: category.color }}>
                    {category.icon}
                  </span>
                  <span className="font-semibold text-sm text-gray-700">{category.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {nodeCount}
                </Badge>
              </button>

              {!isCollapsed && (
                <div className="ml-6 mt-2 space-y-1">
                  {category.nodes.map((node) => (
                    <div
                      key={node.type}
                      className="group p-3 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-md cursor-move transition-all duration-200 border-l-4"
                      style={{ borderLeftColor: node.color }}
                      draggable
                      onDragStart={(event) => onDragStart(event, node)}
                    >
                      <div className="flex items-start">
                        <span className="mr-3 text-lg flex-shrink-0">{node.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 group-hover:text-gray-700">
                            {node.defaultData.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">{node.description}</div>
                          <div className="flex items-center mt-2">
                            <Badge
                              variant="secondary"
                              className="text-xs"
                              style={{ backgroundColor: `${node.color}20`, color: node.color }}
                            >
                              {node.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Drag indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col space-y-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No nodes found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
