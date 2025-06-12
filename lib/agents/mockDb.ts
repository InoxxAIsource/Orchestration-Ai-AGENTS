import type { Agent } from "@/types/agent"

class MockDatabase {
  private agents: Map<string, Agent> = new Map()
  private static instance: MockDatabase

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase()
    }
    return MockDatabase.instance
  }

  private generateId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async create(agentData: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<Agent> {
    const agent: Agent = {
      ...agentData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("MockDB: Creating agent:", agent.name)
    this.agents.set(agent.id, agent)
    console.log("MockDB: Agent created, total agents:", this.agents.size)

    return agent
  }

  async findAll(): Promise<Agent[]> {
    const agents = Array.from(this.agents.values())
    console.log("MockDB: Finding all agents, current count:", agents.length)
    return agents
  }

  async findById(id: string): Promise<Agent | null> {
    const agent = this.agents.get(id) || null
    console.log("MockDB: Finding agent by ID:", id, agent ? "found" : "not found")
    return agent
  }

  async update(id: string, updates: Partial<Omit<Agent, "id" | "createdAt">>): Promise<Agent | null> {
    const existing = this.agents.get(id)
    if (!existing) {
      console.log("MockDB: Update failed - agent not found:", id)
      return null
    }

    const updated: Agent = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    }

    this.agents.set(id, updated)
    console.log("MockDB: Agent updated:", updated.name)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    const existed = this.agents.has(id)
    if (existed) {
      this.agents.delete(id)
      console.log("MockDB: Agent deleted, remaining agents:", this.agents.size)
    } else {
      console.log("MockDB: Delete failed - agent not found:", id)
    }
    return existed
  }

  // Debug method
  getStats() {
    return {
      totalAgents: this.agents.size,
      agentIds: Array.from(this.agents.keys()),
    }
  }
}

export const mockDb = MockDatabase.getInstance()
