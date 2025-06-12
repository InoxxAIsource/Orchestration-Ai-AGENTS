import { type NextRequest, NextResponse } from "next/server"
import { saveOrchestration, listOrchestrations, getOrchestration, deleteOrchestration } from "@/lib/orchestrations"
import type { Orchestration } from "@/types/orchestration"

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required and must be at least 2 characters" }, { status: 400 })
    }

    if (!body.nodes || !Array.isArray(body.nodes)) {
      return NextResponse.json({ error: "Nodes array is required" }, { status: 400 })
    }

    if (body.nodes.length === 0) {
      return NextResponse.json({ error: "At least one node is required" }, { status: 400 })
    }

    const orchestration: Orchestration = {
      id: body.id || generateId(),
      name: body.name.trim(),
      description: body.description || "",
      nodes: body.nodes,
      edges: body.edges || [],
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const savedOrchestration = saveOrchestration(orchestration)
    return NextResponse.json({ success: true, orchestration: savedOrchestration })
  } catch (error) {
    console.error("Failed to save orchestration:", error)
    return NextResponse.json({ error: "Failed to save orchestration" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")

    if (id) {
      const orchestration = getOrchestration(id)
      if (!orchestration) {
        return NextResponse.json({ error: "Orchestration not found" }, { status: 404 })
      }
      return NextResponse.json(orchestration)
    }

    const orchestrations = listOrchestrations()
    return NextResponse.json(orchestrations)
  } catch (error) {
    console.error("Failed to fetch orchestrations:", error)
    return NextResponse.json({ error: "Failed to fetch orchestrations" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const success = deleteOrchestration(id)
    if (!success) {
      return NextResponse.json({ error: "Orchestration not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete orchestration:", error)
    return NextResponse.json({ error: "Failed to delete orchestration" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
