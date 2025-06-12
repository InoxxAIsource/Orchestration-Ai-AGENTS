import { type NextRequest, NextResponse } from "next/server"
import { AgentService } from "@/lib/agents/service"
import { AgentRepository } from "@/lib/agents/repository"
import { ZodError } from "zod"

const service = new AgentService(new AgentRepository())

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("API: Creating agent with data:", body)

    const agent = await service.createAgent(body)
    console.log("API: Agent created successfully:", agent.name)

    return NextResponse.json(agent, { status: 201 })
  } catch (error) {
    console.error("API: Error creating agent:", error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid agent data",
          details: error.format(),
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        error: "Failed to create agent",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const agents = await service.listAgents()
    console.log("API: Fetched agents from service:", agents.length)
    return NextResponse.json(agents)
  } catch (error) {
    console.error("API: Error fetching agents:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch agents",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const dynamic = "force-dynamic"
