"use client"

import { useEffect, useState } from "react"
import type { Agent } from "@/types/agent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      const data = await response.json()
      setAgents(data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading agents...</div>
  }

  if (agents.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No agents created yet. Create your first agent above!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Your Agents</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {agents.map((agent) => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {agent.name}
                <Badge variant="secondary">{agent.model}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{agent.description}</p>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Temperature:</span> {agent.temperature}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Tools:</span>{" "}
                  {agent.tools.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
