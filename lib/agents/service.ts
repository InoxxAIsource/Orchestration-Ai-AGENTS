import type { Agent } from "@/types/agent"
import { AgentFormSchema } from "@/types/agent"
import type { AgentRepository } from "./repository"

export class AgentService {
  constructor(private repository: AgentRepository) {}

  async listAgents(): Promise<Agent[]> {
    console.log("AgentService: Listing all agents")
    const agents = await this.repository.findAll()
    console.log("AgentService: Found", agents.length, "agents")
    return agents
  }

  async getAgent(id: string): Promise<Agent | null> {
    console.log("AgentService: Getting agent", id)
    return await this.repository.findById(id)
  }

  async createAgent(data: unknown): Promise<Agent> {
    console.log("AgentService: Creating agent with data:", data)

    // Validate the input data
    const validatedData = AgentFormSchema.parse(data)
    console.log("AgentService: Data validated successfully")

    const agent = await this.repository.create(validatedData)
    console.log("AgentService: Agent created:", agent.name, "with ID:", agent.id)

    return agent
  }

  async updateAgent(id: string, data: unknown): Promise<Agent | null> {
    console.log("AgentService: Updating agent", id)

    // Validate the input data (partial update)
    const validatedData = AgentFormSchema.partial().parse(data)

    const agent = await this.repository.update(id, validatedData)
    console.log("AgentService: Agent updated:", agent?.name || "not found")

    return agent
  }

  async deleteAgent(id: string): Promise<boolean> {
    console.log("AgentService: Deleting agent", id)

    const deleted = await this.repository.delete(id)
    console.log("AgentService: Agent deletion result:", deleted)

    return deleted
  }

  // Debug method
  getStats() {
    return this.repository.getStats()
  }
}
