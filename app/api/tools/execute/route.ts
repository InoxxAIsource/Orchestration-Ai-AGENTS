import { getToolInstance } from "@/lib/tools/registry"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { toolId, config, action, params } = await req.json()

    // Skip blockchain tools in environments where MetaMask is not available
    if (toolId === "SolidityAuditor") {
      return NextResponse.json(
        {
          success: false,
          error: "Blockchain tools are disabled in this environment. Please use a browser with MetaMask installed.",
        },
        { status: 400 },
      )
    }

    try {
      const tool = getToolInstance(toolId, config)
      if (typeof tool[action] !== "function") throw new Error(`Action ${action} not supported`)

      const result = await tool[action](params)
      return NextResponse.json({ success: true, result })
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : "Unknown error" },
        { status: 400 },
      )
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 })
  }
}
