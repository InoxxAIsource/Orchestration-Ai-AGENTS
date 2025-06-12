"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, FolderOpen } from "lucide-react"
import type { ProjectType } from "@/types/orchestration"
import { toast } from "sonner"

interface ProjectSelectorProps {
  projectId?: string
  onProjectChange?: (projectId: string) => void
}

export function ProjectSelector({ projectId, onProjectChange }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [selectedProject, setSelectedProject] = useState<string>(projectId || "")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    tags: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)

        // If no project is selected and we have projects, select the first one
        if (!selectedProject && data.length > 0) {
          setSelectedProject(data[0].id)
          onProjectChange?.(data[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      toast.error("Failed to load projects")
    }
  }

  const createProject = async () => {
    if (!newProject.name.trim()) {
      toast.error("Project name is required")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      })

      if (response.ok) {
        const project = await response.json()
        setProjects((prev) => [...prev, project])
        setSelectedProject(project.id)
        onProjectChange?.(project.id)
        setIsCreateDialogOpen(false)
        setNewProject({ name: "", description: "", tags: [] })
        toast.success("Project created successfully")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to create project")
      }
    } catch (error) {
      console.error("Failed to create project:", error)
      toast.error("Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProjectChange = (value: string) => {
    setSelectedProject(value)
    onProjectChange?.(value)
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="h-4 w-4 text-gray-600" />
        <Label className="font-semibold">Project</Label>
      </div>

      <div className="flex gap-2">
        <Select value={selectedProject} onValueChange={handleProjectChange}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={createProject} disabled={isLoading} className="flex-1">
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedProjectData && (
        <div className="mt-3 p-2 bg-gray-50 rounded-md">
          <div className="text-sm font-medium">{selectedProjectData.name}</div>
          {selectedProjectData.description && (
            <div className="text-xs text-gray-600">{selectedProjectData.description}</div>
          )}
          {selectedProjectData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedProjectData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
