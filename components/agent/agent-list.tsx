"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Bot, Trash2, RefreshCw, Play } from "lucide-react"
import type { Agent } from "@/types/agent"
import { toast } from "sonner"

interface AgentListProps {
  onSelectAgent: (agent: Agent) => void
  selectedAgent: Agent | null
  refreshTrigger: number
}

export function AgentList({ onSelectAgent, selectedAgent, refreshTrigger }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAgents = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true)

      const response = await fetch("/api/agents", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Fetched agents:", data)

      setAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching agents:", error)
      toast.error("Failed to load agents")
      setAgents([])
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [refreshTrigger])

  const handleDeleteAgent = async (agentId: string, agentName: string) => {
    if (!confirm(`Are you sure you want to delete "${agentName}"?`)) return

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete agent")
      }

      toast.success(`Agent "${agentName}" deleted successfully`)
      await fetchAgents()
    } catch (error) {
      console.error("Error deleting agent:", error)
      toast.error("Failed to delete agent")
    }
  }

  const handleRefresh = () => {
    fetchAgents(true)
  }

  const handleAgentClick = (agent: Agent) => {
    console.log("Agent clicked:", agent)
    if (onSelectAgent && typeof onSelectAgent === "function") {
      onSelectAgent(agent)
    } else {
      console.error("onSelectAgent is not a function:", onSelectAgent)
    }
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Your Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Your Agents ({agents.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No agents yet</p>
            <p className="text-sm">Create your first agent to get started</p>
          </div>
        ) : (
          agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedAgent?.id === agent.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleAgentClick(agent)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.tools.slice(0, 3).map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs px-1 py-0">
                        {tool}
                      </Badge>
                    ))}
                    {agent.tools.length > 3 && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        +{agent.tools.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAgentClick(agent)
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAgent(agent.id, agent.name)
                    }}
                    className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
