"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { NODE_CATEGORIES } from "@/lib/node-definitions"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function NodePalette({
  onDragStart,
  searchTerm,
  selectedCategory,
}: {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeData: any) => void
  searchTerm: string
  selectedCategory: string | null
}) {
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({})

  const toggleCategory = (categoryKey: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }))
  }

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

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>, node: any) => {
      event.stopPropagation()
      onDragStart(event, node)
    },
    [onDragStart],
  )

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredCategories.map(([categoryKey, category]) => (
        <div key={categoryKey} className="mb-4">
          <div
            className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => toggleCategory(categoryKey)}
          >
            <category.icon className="w-4 h-4" style={{ color: category.color }} />
            <span className="font-medium text-sm">{category.label}</span>
            <span className="text-xs text-gray-500 ml-auto">{category.nodes.length}</span>
            {collapsedCategories[categoryKey] ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {!collapsedCategories[categoryKey] && (
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
                    onDragStart={(e) => handleDragStart(e, node)}
                    className="p-2 border border-gray-200 rounded cursor-grab hover:bg-gray-50 hover:border-gray-300 transition-colors active:cursor-grabbing"
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
          )}
        </div>
      ))}
      {filteredCategories.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <div className="text-sm">No nodes found</div>
          <div className="text-xs mt-1">Try adjusting your search or category filter</div>
        </div>
      )}
    </div>
  )
}
