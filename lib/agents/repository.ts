import type { Agent } from "@/types/agent"
import { mockDb } from "./mockDb"

export class AgentRepository {
  async findAll(): Promise<Agent[]> {
    return await mockDb.findAll()
  }

  async findById(id: string): Promise<Agent | null> {
    return await mockDb.findById(id)
  }

  async create(agentData: Omit<Agent, "id" | "createdAt" | "updatedAt">): Promise<Agent> {
    return await mockDb.create(agentData)
  }

  async update(id: string, updates: Partial<Omit<Agent, "id" | "createdAt">>): Promise<Agent | null> {
    return await mockDb.update(id, updates)
  }

  async delete(id: string): Promise<boolean> {
    return await mockDb.delete(id)
  }

  // Debug method
  getStats() {
    return mockDb.getStats()
  }
}
