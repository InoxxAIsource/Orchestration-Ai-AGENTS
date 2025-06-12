import type { Orchestration, ProjectType, OrchestrationVersion } from "@/types/orchestration"

const ORCHESTRATIONS_KEY = "orchestrations"
const PROJECTS_KEY = "projects"
const VERSIONS_KEY = "orchestration_versions"

// Abstract storage interface for future DB integration
interface IOrchestrationStorage {
  saveOrchestration(orchestration: Orchestration): Promise<Orchestration>
  getOrchestration(id: string): Promise<Orchestration | undefined>
  listOrchestrations(projectId?: string): Promise<Orchestration[]>
  deleteOrchestration(id: string): Promise<boolean>
  createVersion(orchestrationId: string, notes: string, snapshot: any): Promise<OrchestrationVersion>
  getVersions(orchestrationId: string): Promise<OrchestrationVersion[]>
  getVersion(orchestrationId: string, version: string): Promise<OrchestrationVersion | undefined>

  // Project management
  createProject(project: Omit<ProjectType, "id" | "createdAt" | "updatedAt">): Promise<ProjectType>
  getProject(id: string): Promise<ProjectType | undefined>
  listProjects(): Promise<ProjectType[]>
  updateProject(id: string, updates: Partial<ProjectType>): Promise<ProjectType | undefined>
  deleteProject(id: string): Promise<boolean>
}

// LocalStorage implementation
class LocalStorageAdapter implements IOrchestrationStorage {
  private getStorageData<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage:`, error)
      return []
    }
  }

  private setStorageData<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error)
    }
  }

  async saveOrchestration(orchestration: Orchestration): Promise<Orchestration> {
    const orchestrations = this.getStorageData<Orchestration>(ORCHESTRATIONS_KEY)
    const existingIndex = orchestrations.findIndex((o) => o.id === orchestration.id)

    const now = new Date().toISOString()
    const updatedOrchestration = {
      ...orchestration,
      updatedAt: now,
      createdAt: orchestration.createdAt || now,
      currentVersion: orchestration.currentVersion || "1.0.0",
    }

    if (existingIndex >= 0) {
      orchestrations[existingIndex] = updatedOrchestration
    } else {
      orchestrations.push(updatedOrchestration)
    }

    this.setStorageData(ORCHESTRATIONS_KEY, orchestrations)
    return updatedOrchestration
  }

  async getOrchestration(id: string): Promise<Orchestration | undefined> {
    const orchestrations = this.getStorageData<Orchestration>(ORCHESTRATIONS_KEY)
    return orchestrations.find((o) => o.id === id)
  }

  async listOrchestrations(projectId?: string): Promise<Orchestration[]> {
    const orchestrations = this.getStorageData<Orchestration>(ORCHESTRATIONS_KEY)
    return projectId ? orchestrations.filter((o) => o.projectId === projectId) : orchestrations
  }

  async deleteOrchestration(id: string): Promise<boolean> {
    const orchestrations = this.getStorageData<Orchestration>(ORCHESTRATIONS_KEY)
    const filtered = orchestrations.filter((o) => o.id !== id)
    this.setStorageData(ORCHESTRATIONS_KEY, filtered)
    return filtered.length < orchestrations.length
  }

  async createVersion(orchestrationId: string, notes: string, snapshot: any): Promise<OrchestrationVersion> {
    const versions = this.getStorageData<OrchestrationVersion & { orchestrationId: string }>(VERSIONS_KEY)
    const orchestrationVersions = versions.filter((v) => v.orchestrationId === orchestrationId)

    const newVersion: OrchestrationVersion & { orchestrationId: string } = {
      orchestrationId,
      version: `${orchestrationVersions.length + 1}.0.0`,
      createdAt: new Date().toISOString(),
      createdBy: "current-user", // Replace with actual user
      notes,
      snapshot,
    }

    versions.push(newVersion)
    this.setStorageData(VERSIONS_KEY, versions)
    return newVersion
  }

  async getVersions(orchestrationId: string): Promise<OrchestrationVersion[]> {
    const versions = this.getStorageData<OrchestrationVersion & { orchestrationId: string }>(VERSIONS_KEY)
    return versions.filter((v) => v.orchestrationId === orchestrationId)
  }

  async getVersion(orchestrationId: string, version: string): Promise<OrchestrationVersion | undefined> {
    const versions = this.getStorageData<OrchestrationVersion & { orchestrationId: string }>(VERSIONS_KEY)
    return versions.find((v) => v.orchestrationId === orchestrationId && v.version === version)
  }

  async createProject(project: Omit<ProjectType, "id" | "createdAt" | "updatedAt">): Promise<ProjectType> {
    const projects = this.getStorageData<ProjectType>(PROJECTS_KEY)
    const now = new Date().toISOString()

    const newProject: ProjectType = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      createdBy: "current-user", // Replace with actual user
    }

    projects.push(newProject)
    this.setStorageData(PROJECTS_KEY, projects)
    return newProject
  }

  async getProject(id: string): Promise<ProjectType | undefined> {
    const projects = this.getStorageData<ProjectType>(PROJECTS_KEY)
    return projects.find((p) => p.id === id)
  }

  async listProjects(): Promise<ProjectType[]> {
    return this.getStorageData<ProjectType>(PROJECTS_KEY)
  }

  async updateProject(id: string, updates: Partial<ProjectType>): Promise<ProjectType | undefined> {
    const projects = this.getStorageData<ProjectType>(PROJECTS_KEY)
    const index = projects.findIndex((p) => p.id === id)

    if (index === -1) return undefined

    const updatedProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    projects[index] = updatedProject
    this.setStorageData(PROJECTS_KEY, projects)
    return updatedProject
  }

  async deleteProject(id: string): Promise<boolean> {
    const projects = this.getStorageData<ProjectType>(PROJECTS_KEY)
    const filtered = projects.filter((p) => p.id !== id)
    this.setStorageData(PROJECTS_KEY, filtered)
    return filtered.length < projects.length
  }
}

// Export singleton instance
export const storage = new LocalStorageAdapter()

// Legacy functions for backward compatibility
export function saveOrchestration(orchestration: Orchestration): Orchestration {
  // This is now async, but we'll handle it synchronously for compatibility
  const result = storage.saveOrchestration(orchestration)
  return orchestration // Return immediately for now
}

export function listOrchestrations(): Orchestration[] {
  // Synchronous version for compatibility
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(ORCHESTRATIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to parse orchestrations from localStorage:", error)
    return []
  }
}

export function getOrchestration(id: string): Orchestration | undefined {
  const orchestrations = listOrchestrations()
  return orchestrations.find((o) => o.id === id)
}

export function deleteOrchestration(id: string): boolean {
  if (typeof window === "undefined") return false
  const orchestrations = listOrchestrations().filter((o) => o.id !== id)
  try {
    localStorage.setItem(ORCHESTRATIONS_KEY, JSON.stringify(orchestrations))
    return true
  } catch (error) {
    console.error("Failed to delete orchestration:", error)
    return false
  }
}
