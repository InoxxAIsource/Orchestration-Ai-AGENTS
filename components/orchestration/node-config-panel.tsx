"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { NodeType } from "@/types/orchestration"

interface NodeConfigPanelProps {
  node: NodeType
  onClose: () => void
  onUpdate: (updatedNode: NodeType) => void
  onDelete: (nodeId: string) => void
}

export default function NodeConfigPanel({ node, onClose, onUpdate, onDelete }: NodeConfigPanelProps) {
  const [localNode, setLocalNode] = useState<NodeType>({ ...node })

  const handleChange = (field: string, value: any) => {
    setLocalNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }))
  }

  const handleConfigChange = (field: string, value: any) => {
    setLocalNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        config: {
          ...(prev.data.config || {}),
          [field]: value,
        },
      },
    }))
  }

  const handleSave = () => {
    onUpdate(localNode)
  }

  const renderSpecificConfig = () => {
    switch (node.data.type) {
      case "webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label>Webhook URL</Label>
              <Input
                value={localNode.data.parameters?.url || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    url: e.target.value,
                  })
                }
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <Label>Method</Label>
              <select
                className="w-full p-2 border rounded"
                value={localNode.data.parameters?.method || "POST"}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    method: e.target.value,
                  })
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        )

      case "cron":
        return (
          <div className="space-y-4">
            <div>
              <Label>Schedule Expression</Label>
              <Input
                value={localNode.data.parameters?.expression || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    expression: e.target.value,
                  })
                }
                placeholder="0 0 * * *"
              />
              <p className="text-xs text-gray-500 mt-1">Cron expression (e.g., "0 0 * * *" for daily at midnight)</p>
            </div>
            <div>
              <Label>Timezone</Label>
              <Input
                value={localNode.data.parameters?.timezone || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    timezone: e.target.value,
                  })
                }
                placeholder="UTC"
              />
            </div>
          </div>
        )

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Expression</Label>
              <Textarea
                value={localNode.data.parameters?.expression || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    expression: e.target.value,
                  })
                }
                placeholder="data.value > 100"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">JavaScript expression that evaluates to true/false</p>
            </div>
          </div>
        )

      case "api":
        return (
          <div className="space-y-4">
            <div>
              <Label>API URL</Label>
              <Input
                value={localNode.data.parameters?.url || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    url: e.target.value,
                  })
                }
                placeholder="https://api.example.com/data"
              />
            </div>
            <div>
              <Label>Method</Label>
              <select
                className="w-full p-2 border rounded"
                value={localNode.data.parameters?.method || "GET"}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    method: e.target.value,
                  })
                }
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <Label>Headers</Label>
              <Textarea
                value={localNode.data.parameters?.headers || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    headers: e.target.value,
                  })
                }
                placeholder='{"Content-Type": "application/json"}'
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">JSON format</p>
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                value={localNode.data.parameters?.body || ""}
                onChange={(e) =>
                  handleChange("parameters", {
                    ...(localNode.data.parameters || {}),
                    body: e.target.value,
                  })
                }
                placeholder='{"key": "value"}'
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">JSON format</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Node Configuration</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="basic">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="specific">Specific</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label>Label</Label>
            <Input value={localNode.data.label} onChange={(e) => handleChange("label", e.target.value)} />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={localNode.data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localNode.data.color || "#000000"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-10 h-10 rounded"
              />
              <Input
                value={localNode.data.color || ""}
                onChange={(e) => handleChange("color", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label>Retry Policy</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable Retries</span>
                <Switch
                  checked={!!localNode.data.config?.retryPolicy}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleConfigChange("retryPolicy", { maxAttempts: 3, backoffFactor: 1.5 })
                    } else {
                      const { retryPolicy, ...rest } = localNode.data.config || {}
                      setLocalNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          config: rest,
                        },
                      }))
                    }
                  }}
                />
              </div>

              {localNode.data.config?.retryPolicy && (
                <>
                  <div>
                    <Label className="text-xs">Max Attempts</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[localNode.data.config.retryPolicy.maxAttempts]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(value) =>
                          handleConfigChange("retryPolicy", {
                            ...localNode.data.config?.retryPolicy,
                            maxAttempts: value[0],
                          })
                        }
                        className="flex-1"
                      />
                      <span className="text-sm w-8 text-center">{localNode.data.config.retryPolicy.maxAttempts}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Backoff Factor</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[localNode.data.config.retryPolicy.backoffFactor]}
                        min={1}
                        max={5}
                        step={0.1}
                        onValueChange={(value) =>
                          handleConfigChange("retryPolicy", {
                            ...localNode.data.config?.retryPolicy,
                            backoffFactor: value[0],
                          })
                        }
                        className="flex-1"
                      />
                      <span className="text-sm w-8 text-center">{localNode.data.config.retryPolicy.backoffFactor}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <Label>Timeout (seconds)</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[localNode.data.config?.timeout || 30]}
                min={1}
                max={300}
                step={1}
                onValueChange={(value) => handleConfigChange("timeout", value[0])}
                className="flex-1"
              />
              <span className="text-sm w-8 text-center">{localNode.data.config?.timeout || 30}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="specific" className="space-y-4">
          {renderSpecificConfig()}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button variant="destructive" onClick={() => onDelete(node.id)}>
          Delete
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
