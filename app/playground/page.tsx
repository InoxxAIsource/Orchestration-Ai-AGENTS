"use client"

import { useState, useEffect, useCallback } from "react"
import { AgentForm } from "@/components/agent/agent-form"
import { AgentList } from "@/components/agent/agent-list"
import { AgentTester } from "@/components/agent/agent-tester"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import type { Agent } from "@/types/agent"

export default function PlaygroundPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/agents")
      if (!response.ok) throw new Error("Failed to fetch agents")
      const data = await response.json()
      setAgents(data)
      console.log("Fetched agents:", data)
    } catch (error) {
      console.error("Error fetching agents:", error)
      setAgents([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents, refreshTrigger])

  const handleAgentCreated = useCallback(() => {
    console.log("Agent created, refreshing list...")
    setRefreshTrigger((prev) => prev + 1)
    setIsCreating(false)
    toast.success("Agent created successfully!")
  }, [])

  const handleSelectAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent)
    console.log("Selected agent:", agent)
  }, [])

  const handleTestAgent = useCallback((agent: Agent) => {
    setSelectedAgent(agent)
    console.log("Testing agent:", agent)
  }, [])

  const handleDeleteAgent = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/agents/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete agent")

        setRefreshTrigger((prev) => prev + 1)

        if (selectedAgent?.id === id) {
          setSelectedAgent(null)
        }

        toast.success("Agent deleted successfully!")
      } catch (error) {
        console.error("Error deleting agent:", error)
        toast.error("Failed to delete agent. Please try again.")
      }
    },
    [selectedAgent],
  )

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Agent Playground</h1>
          <p className="text-gray-600 mt-1">Create, manage, and test AI agents in real-time</p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-[#4339F2] hover:bg-[#3730d8]">
            <Plus className="mr-2 h-4 w-4" /> Create Agent
          </Button>
        )}
        {isCreating && (
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Agents
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-1 space-y-6">
          {isCreating ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Create New Agent</h2>
              </div>
              <div className="p-4">
                <AgentForm onAgentCreated={handleAgentCreated} />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border h-full">
              <AgentList
                onSelectAgent={handleSelectAgent}
                selectedAgent={selectedAgent}
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedAgent ? `Testing: ${selectedAgent.name}` : "Select an Agent to Test"}
              </h2>
              {selectedAgent && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Model: {selectedAgent.model} | Tools: {selectedAgent.tools.length}
                </p>
              )}
            </div>
            <div className="h-[calc(100%-5rem)]">
              <AgentTester agent={selectedAgent} onSelectAgent={() => setIsCreating(false)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
