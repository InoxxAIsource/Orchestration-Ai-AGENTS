"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AgentFormSchema, MODELS, TOOLS } from "@/types/agent"
import type { AgentFormData } from "@/types/agent"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useCallback, useMemo } from "react"
import { ToolConfiguration } from "./tool-configuration"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"

interface AgentFormProps {
  onAgentCreated?: () => void
}

export function AgentForm({ onAgentCreated }: AgentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configuredTool, setConfiguredTool] = useState<string | null>(null)

  const form = useForm<AgentFormData>({
    resolver: zodResolver(AgentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      model: "gpt-4o",
      temperature: 0.7,
      systemPrompt: "",
      tools: [],
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form

  const temperature = watch("temperature")
  const selectedTools = watch("tools") || []

  // Filter out disabled tools
  const availableTools = useMemo(() => {
    return TOOLS.filter((tool) => !tool.config.disabled)
  }, [])

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const categories = {} as Record<string, typeof TOOLS>
    availableTools.forEach((tool) => {
      const category = tool.config.category
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(tool)
    })
    return categories
  }, [availableTools])

  const onSubmit = useCallback(
    async (data: AgentFormData) => {
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/agents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create agent")
        }

        toast.success("Agent created successfully!")
        reset()
        onAgentCreated?.()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create agent")
      } finally {
        setIsSubmitting(false)
      }
    },
    [reset, onAgentCreated],
  )

  const handleToolChange = useCallback(
    (toolId: string, checked: boolean) => {
      const currentTools = selectedTools
      if (checked) {
        setValue("tools", [...currentTools, toolId])
      } else {
        setValue(
          "tools",
          currentTools.filter((id) => id !== toolId),
        )
      }
    },
    [selectedTools, setValue],
  )

  const handleTemperatureChange = useCallback(
    (value: number[]) => {
      setValue("temperature", value[0])
    },
    [setValue],
  )

  const handleModelChange = useCallback(
    (value: string) => {
      setValue("model", value as any)
    },
    [setValue],
  )

  const handleConfigureTool = useCallback((toolId: string) => {
    setConfiguredTool(toolId)
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Agent</CardTitle>
      </CardHeader>
      <CardContent>
        {configuredTool ? (
          <ToolConfiguration toolId={configuredTool} onClose={() => setConfiguredTool(null)} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter agent name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select value={watch("model")} onValueChange={handleModelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this agent does"
                  {...register("description")}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature</Label>
                  <span className="text-sm text-gray-500">{temperature}</span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={handleTemperatureChange}
                />
                {errors.temperature && <p className="text-sm text-red-500">{errors.temperature.message}</p>}
              </div>

              {/* System Prompt */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Enter the system prompt for this agent"
                  {...register("systemPrompt")}
                  className={errors.systemPrompt ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.systemPrompt && <p className="text-sm text-red-500">{errors.systemPrompt.message}</p>}
              </div>

              {/* Tools Multi-select */}
              <div className="space-y-3 md:col-span-2">
                <Label className="text-base font-semibold">Tools</Label>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {Object.keys(toolsByCategory).map((category) => (
                      <TabsTrigger key={category} value={category} className="capitalize">
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availableTools.map((tool) => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={tool.id}
                              checked={selectedTools.includes(tool.id)}
                              onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
                            />
                            <div>
                              <Label htmlFor={tool.id} className="text-sm font-medium cursor-pointer">
                                {tool.name}
                              </Label>
                              <p className="text-xs text-gray-500">{tool.description}</p>
                            </div>
                          </div>
                          {tool.config.requiresSetup && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleConfigureTool(tool.id)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {Object.entries(toolsByCategory).map(([category, tools]) => (
                    <TabsContent key={category} value={category}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tools.map((tool) => (
                          <div
                            key={tool.id}
                            className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${category}-${tool.id}`}
                                checked={selectedTools.includes(tool.id)}
                                onCheckedChange={(checked) => handleToolChange(tool.id, checked as boolean)}
                              />
                              <div>
                                <Label
                                  htmlFor={`${category}-${tool.id}`}
                                  className="text-sm font-medium cursor-pointer"
                                >
                                  {tool.name}
                                </Label>
                                <p className="text-xs text-gray-500">{tool.description}</p>
                              </div>
                            </div>
                            {tool.config.requiresSetup && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleConfigureTool(tool.id)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>

                {errors.tools && <p className="text-sm text-red-500">{errors.tools.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#4339F2] hover:bg-[#3730d8]" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Agent"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
