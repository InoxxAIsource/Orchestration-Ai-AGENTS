import type { Agent } from "@/types/agent"

const agents: Agent[] = []

export function saveAgent(agent: Agent) {
  agents.push(agent)
}

export function listAgents() {
  return agents
}
