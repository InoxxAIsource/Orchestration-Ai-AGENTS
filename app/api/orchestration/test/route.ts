import { type NextRequest, NextResponse } from "next/server"
import type { NodeType, EdgeType, TestResult } from "@/types/orchestration"

export async function POST(req: NextRequest) {
  try {
    const { nodes, edges }: { nodes: NodeType[]; edges: EdgeType[] } = await req.json()

    const results: TestResult[] = []

    // Validate workflow structure
    const startNodes = nodes.filter((n) => n.data.type === "start")
    const endNodes = nodes.filter((n) => n.data.type === "end")

    if (startNodes.length === 0) {
      results.push({
        nodeId: "workflow",
        status: "error",
        message: "Workflow must have at least one start node",
      })
    }

    if (endNodes.length === 0) {
      results.push({
        nodeId: "workflow",
        status: "warning",
        message: "Workflow should have at least one end node",
      })
    }

    // Check for orphaned nodes
    const connectedNodeIds = new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)])

    nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.id) && node.data.type !== "start") {
        results.push({
          nodeId: node.id,
          status: "warning",
          message: "Node is not connected to the workflow",
        })
      }
    })

    // Validate node configurations
    nodes.forEach((node) => {
      if (node.data.type === "action" && !node.data.agentId) {
        results.push({
          nodeId: node.id,
          status: "error",
          message: "Action node must have an associated agent",
        })
      }

      if (node.data.type === "condition" && !node.data.config.conditions?.length) {
        results.push({
          nodeId: node.id,
          status: "warning",
          message: "Condition node should have at least one condition",
        })
      }
    })

    // Check for circular dependencies
    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    function hasCycle(nodeId: string): boolean {
      if (recursionStack.has(nodeId)) return true
      if (visited.has(nodeId)) return false

      visited.add(nodeId)
      recursionStack.add(nodeId)

      const outgoingEdges = edges.filter((e) => e.source === nodeId)
      for (const edge of outgoingEdges) {
        if (hasCycle(edge.target)) return true
      }

      recursionStack.delete(nodeId)
      return false
    }

    for (const node of nodes) {
      if (hasCycle(node.id)) {
        results.push({
          nodeId: node.id,
          status: "error",
          message: "Circular dependency detected",
        })
        break
      }
    }

    // If no issues found, mark as success
    if (results.length === 0) {
      results.push({
        nodeId: "workflow",
        status: "success",
        message: "Workflow validation passed",
      })
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Failed to test orchestration:", error)
    return NextResponse.json({ error: "Failed to run tests" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
