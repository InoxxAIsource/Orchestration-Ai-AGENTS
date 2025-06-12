import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/orchestrations"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { notes } = await req.json()
    const orchestration = await storage.getOrchestration(params.id)

    if (!orchestration) {
      return NextResponse.json({ error: "Orchestration not found" }, { status: 404 })
    }

    const snapshot = {
      nodes: orchestration.nodes,
      edges: orchestration.edges,
      variables: orchestration.variables,
    }

    const version = await storage.createVersion(params.id, notes || "Version snapshot", snapshot)
    return NextResponse.json(version, { status: 201 })
  } catch (error) {
    console.error("Failed to create version:", error)
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const version = req.nextUrl.searchParams.get("version")

    if (version) {
      const data = await storage.getVersion(params.id, version)
      if (!data) {
        return NextResponse.json({ error: "Version not found" }, { status: 404 })
      }
      return NextResponse.json(data)
    }

    const versions = await storage.getVersions(params.id)
    return NextResponse.json(versions)
  } catch (error) {
    console.error("Failed to fetch versions:", error)
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
