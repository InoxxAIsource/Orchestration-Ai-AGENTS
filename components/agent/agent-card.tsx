"use client"

import { formatDistanceToNow } from "date-fns"
import type { Agent } from "@/types/agent"
import { MODELS, TOOLS } from "@/types/agent"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash, Edit, Play } from "lucide-react"

interface AgentCardProps {
  agent: Agent
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onTest: (id: string) => void
}

export function AgentCard({ agent, onDelete, onEdit, onTest }: AgentCardProps) {
  const modelName = MODELS.find((m) => m.id === agent.model)?.name || agent.model

  const getToolInfo = (toolId: string) => {
    return TOOLS.find((t) => t.id === toolId)
  }

  // Group tools by category
  const toolsByCategory = agent.tools.reduce(
    (acc, toolId) => {
      const tool = getToolInfo(toolId)
      if (tool) {
        const category = tool.config.category
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(tool)
      }
      return acc
    },
    {} as Record<string, typeof TOOLS>,
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{agent.name}</CardTitle>
          <Badge variant="outline">{modelName}</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Temperature</p>
            <p className="text-sm">{agent.temperature}</p>
          </div>

          {agent.tools.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Tools</p>
              <div className="space-y-2">
                {Object.entries(toolsByCategory).map(([category, tools]) => (
                  <div key={category}>
                    <p className="text-xs text-gray-500 capitalize">{category}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tools.map((tool) => (
                        <Badge key={tool.id} variant="secondary" className="text-xs">
                          {tool.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-500">Created</p>
            <p className="text-sm">{formatDistanceToNow(new Date(agent.createdAt), { addSuffix: true })}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onTest(agent.id)}>
          <Play className="h-4 w-4 mr-1" /> Test
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(agent.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(agent.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
