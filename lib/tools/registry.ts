import { TwitterTool } from "./twitter"
import { TelegramTool } from "./telegram"

type ToolConstructor = new (config: any) => any

export const TOOL_REGISTRY: Record<string, ToolConstructor> = {
  TwitterTool,
  TelegramTool,
  // Add other tools as they are implemented
}

export function getToolInstance(toolId: string, config: any) {
  const ToolClass = TOOL_REGISTRY[toolId]
  if (!ToolClass) {
    console.warn(`Tool ${toolId} not found in registry`)
    // Return a mock instance for unknown tools
    return {
      execute: () => Promise.resolve({ error: `Tool ${toolId} not available` }),
      validate: () => false,
      name: toolId,
    }
  }

  try {
    return new ToolClass(config)
  } catch (error) {
    console.error(`Failed to instantiate tool ${toolId}:`, error)
    // Return a mock instance for failed tool instantiation
    return {
      execute: () => Promise.resolve({ error: `Failed to initialize ${toolId}` }),
      validate: () => false,
      name: toolId,
    }
  }
}

// Safe tool registry that doesn't execute during module load
export function getAvailableTools(): string[] {
  return Object.keys(TOOL_REGISTRY)
}

export function isToolAvailable(toolId: string): boolean {
  return toolId in TOOL_REGISTRY
}
