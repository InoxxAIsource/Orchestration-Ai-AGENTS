"use client"

import { useState } from "react"
import { availableModels, availableTools } from "@/types/agent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    model: availableModels[0],
    temperature: 0.7,
    systemPrompt: "",
    tools: [] as string[],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        alert("Agent saved successfully!")
        setForm({
          name: "",
          description: "",
          model: availableModels[0],
          temperature: 0.7,
          systemPrompt: "",
          tools: [],
        })
      }
    } catch (error) {
      alert("Error saving agent")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToolChange = (tool: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      tools: checked ? [...prev.tools, tool] : prev.tools.filter((t) => t !== tool),
    }))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name</Label>
          <Input
            id="name"
            placeholder="Enter agent name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what this agent does"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={form.model} onValueChange={(value) => setForm({ ...form, model: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Temperature: {form.temperature}</Label>
          <Slider
            value={[form.temperature]}
            onValueChange={(value) => setForm({ ...form, temperature: value[0] })}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="systemPrompt">System Prompt</Label>
          <Textarea
            id="systemPrompt"
            placeholder="Enter the system prompt for this agent"
            value={form.systemPrompt}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Tools</Label>
          <div className="grid grid-cols-2 gap-3">
            {availableTools.map((tool) => (
              <div key={tool} className="flex items-center space-x-2">
                <Checkbox
                  id={tool}
                  checked={form.tools.includes(tool)}
                  onCheckedChange={(checked) => handleToolChange(tool, checked as boolean)}
                />
                <Label htmlFor={tool} className="text-sm font-normal cursor-pointer">
                  {tool}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-[#4339F2] hover:bg-[#3730d8]" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Agent"}
        </Button>
      </CardContent>
    </Card>
  )
}
