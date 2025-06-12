import { type NextRequest, NextResponse } from "next/server"
import { AgentService } from "@/lib/agents/service"
import { AgentRepository } from "@/lib/agents/repository"

const service = new AgentService(new AgentRepository())

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const agent = await service.getAgent(params.id)
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }
    return NextResponse.json(agent)
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch agent",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const agent = await service.updateAgent(params.id, body)
    return NextResponse.json(agent)
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      {
        error: "Failed to update agent",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await service.deleteAgent(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json(
      {
        error: "Failed to delete agent",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
