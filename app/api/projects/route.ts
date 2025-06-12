import { type NextRequest, NextResponse } from "next/server"
import { storage } from "@/lib/orchestrations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation
    if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required and must be at least 2 characters" }, { status: 400 })
    }

    const project = await storage.createProject({
      name: body.name.trim(),
      description: body.description || "",
      tags: body.tags || [],
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await storage.listProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
