"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Agent } from "@/types/agent"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAgent = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/agents/${id}`)
        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Agent not found")
            router.push("/playground")
            return
          }
          throw new Error("Failed to fetch agent")
        }

        const data = await response.json()
        setAgent({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        })
      } catch (error) {
        console.error("Failed to load agent:", error)
        toast.error("Failed to load agent")
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  useEffect(() => {
    if (params.id) {
      fetchAgent(params.id as string)
    }
  }, [params.id, fetchAgent])

  const handleBack = useCallback(() => {
    router.push("/playground")
  }, [router])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center p-8">
          <p className="text-gray-500 dark:text-gray-400">Agent not found</p>
          <Button onClick={handleBack} className="mt-4">
            Back to Playground
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Playground
        </Button>
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{agent.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{agent.description}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Agent Details</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Model</h3>
                <p>{agent.model}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Temperature</h3>
                <p>{agent.temperature}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">System Prompt</h3>
                <p className="whitespace-pre-wrap">{agent.systemPrompt}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tools</h3>
                <p>{agent.tools.join(", ") || "None"}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Agent</h2>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Testing functionality coming soon!</p>
            <Button disabled>Test Agent</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
