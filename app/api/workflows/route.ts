import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (use database in production)
const workflows: Record<string, any> = {}

export async function POST(request: NextRequest) {
  try {
    const { id, nodes, edges } = await request.json()

    workflows[id] = {
      id,
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      id,
      message: "Workflow saved successfully",
    })
  } catch (error) {
    console.error("Failed to save workflow:", error)
    return NextResponse.json({ error: "Failed to save workflow" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id && workflows[id]) {
      return NextResponse.json(workflows[id])
    }

    return NextResponse.json({ nodes: [], edges: [] })
  } catch (error) {
    console.error("Failed to fetch workflow:", error)
    return NextResponse.json({ error: "Failed to fetch workflow" }, { status: 500 })
  }
}
