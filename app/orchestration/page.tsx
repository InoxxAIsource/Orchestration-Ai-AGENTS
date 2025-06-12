"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import OrchestrationBuilder from "@/components/orchestration-builder"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Orchestration } from "@/types/orchestration"

export default function OrchestrationPage() {
  const searchParams = useSearchParams()
  const [initialOrchestration, setInitialOrchestration] = useState<Orchestration | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      fetch(`/api/orchestration?id=${id}`)
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          throw new Error("Orchestration not found")
        })
        .then((data) => {
          setInitialOrchestration(data)
        })
        .catch((error) => {
          console.error("Failed to load orchestration:", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {initialOrchestration ? "Edit Orchestration" : "Orchestration Builder"}
            </h1>
            <p className="text-gray-600">Create visual workflows by connecting AI agents</p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <OrchestrationBuilder initialOrchestration={initialOrchestration} />
    </div>
  )
}
