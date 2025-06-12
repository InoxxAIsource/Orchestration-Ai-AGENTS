"use client"

import { useState, useCallback } from "react"
import { X, Save, Trash2, Copy, Settings, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getNodeDefinition } from "@/lib/node-definitions"
import type { Node } from "@xyflow/react"

interface EnhancedNodeConfigProps {
  node: Node
  onClose: () => void
  onUpdate: (updatedNode: Node) => void
  onDelete: (nodeId: string) => void
  onDuplicate?: (node: Node) => void
}

export default function EnhancedNodeConfig({
  node,
  onClose,
  onUpdate,
  onDelete,
  onDuplicate,
}: EnhancedNodeConfigProps) {
  const [localNode, setLocalNode] = useState<Node>({ ...node })
  const nodeDefinition = getNodeDefinition(node.data.type)

  const handleChange = useCallback((field: string, value: any) => {
    setLocalNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [field]: value,
      },
    }))
  }, [])

  const handleParameterChange = useCallback((paramKey: string, value: any) => {
    setLocalNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        parameters: {
          ...(prev.data.parameters || {}),
          [paramKey]: value,
        },
      },
    }))
  }, [])

  const handleConfigChange = useCallback((configKey: string, value: any) => {
    setLocalNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        config: {
          ...(prev.data.config || {}),
          [configKey]: value,
        },
      },
    }))
  }, [])

  const handleSave = useCallback(() => {
    onUpdate(localNode)
    onClose()
  }, [localNode, onUpdate, onClose])

  const handleDuplicate = useCallback(() => {
    if (onDuplicate) {
      onDuplicate(localNode)
    }
  }, [localNode, onDuplicate])

  const renderParameterField = (paramKey: string, paramValue: any, paramType?: string) => {
    switch (paramType || typeof paramValue) {
      case "boolean":
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={paramKey} className="text-sm">
              {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            </Label>
            <Switch
              id={paramKey}
              checked={paramValue}
              onCheckedChange={(checked) => handleParameterChange(paramKey, checked)}
            />
          </div>
        )

      case "number":
        return (
          <div>
            <Label htmlFor={paramKey} className="text-sm">
              {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            </Label>
            <Input
              id={paramKey}
              type="number"
              value={paramValue}
              onChange={(e) => handleParameterChange(paramKey, Number(e.target.value))}
            />
          </div>
        )

      case "array":
        return (
          <div>
            <Label htmlFor={paramKey} className="text-sm">
              {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            </Label>
            <Textarea
              id={paramKey}
              value={Array.isArray(paramValue) ? paramValue.join("\n") : ""}
              onChange={(e) => handleParameterChange(paramKey, e.target.value.split("\n").filter(Boolean))}
              placeholder="One item per line"
              rows={3}
            />
          </div>
        )

      case "object":
        return (
          <div>
            <Label htmlFor={paramKey} className="text-sm">
              {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            </Label>
            <Textarea
              id={paramKey}
              value={typeof paramValue === "object" ? JSON.stringify(paramValue, null, 2) : "{}"}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  handleParameterChange(paramKey, parsed)
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              placeholder="JSON object"
              rows={4}
            />
          </div>
        )

      default:
        if (paramKey.includes("url") || paramKey.includes("endpoint")) {
          return (
            <div>
              <Label htmlFor={paramKey} className="text-sm">
                {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
              </Label>
              <Input
                id={paramKey}
                type="url"
                value={paramValue}
                onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )
        }

        if (paramKey.includes("email")) {
          return (
            <div>
              <Label htmlFor={paramKey} className="text-sm">
                {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
              </Label>
              <Input
                id={paramKey}
                type="email"
                value={paramValue}
                onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                placeholder="user@example.com"
              />
            </div>
          )
        }

        if (paramKey.includes("password") || paramKey.includes("secret") || paramKey.includes("token")) {
          return (
            <div>
              <Label htmlFor={paramKey} className="text-sm">
                {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
              </Label>
              <Input
                id={paramKey}
                type="password"
                value={paramValue}
                onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )
        }

        if (paramKey === "method") {
          return (
            <div>
              <Label htmlFor={paramKey} className="text-sm">
                HTTP Method
              </Label>
              <Select value={paramValue} onValueChange={(value) => handleParameterChange(paramKey, value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        }

        if (paramKey === "model") {
          return (
            <div>
              <Label htmlFor={paramKey} className="text-sm">
                AI Model
              </Label>
              <Select value={paramValue} onValueChange={(value) => handleParameterChange(paramKey, value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4 Omni</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="mistral-large">Mistral Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        }

        if (paramKey === "temperature") {
          return (
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor={paramKey} className="text-sm">
                  Temperature
                </Label>
                <span className="text-sm text-gray-500">{paramValue}</span>
              </div>
              <Slider
                value={[paramValue]}
                onValueChange={(value) => handleParameterChange(paramKey, value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          )
        }

        return (
          <div>
            <Label htmlFor={paramKey} className="text-sm">
              {paramKey.charAt(0).toUpperCase() + paramKey.slice(1)}
            </Label>
            {paramKey.includes("message") || paramKey.includes("body") || paramKey.includes("prompt") ? (
              <Textarea
                id={paramKey}
                value={paramValue}
                onChange={(e) => handleParameterChange(paramKey, e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                id={paramKey}
                value={paramValue}
                onChange={(e) => handleParameterChange(paramKey, e.target.value)}
              />
            )}
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{localNode.data.icon}</span>
          <div>
            <h2 className="text-lg font-bold">{localNode.data.label}</h2>
            <p className="text-sm text-gray-500">{nodeDefinition?.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="basic" className="h-full">
          <TabsList className="w-full px-4 pt-4">
            <TabsTrigger value="basic" className="flex-1">
              Basic
            </TabsTrigger>
            <TabsTrigger value="parameters" className="flex-1">
              Parameters
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="p-4 space-y-4">
            <div>
              <Label htmlFor="label">Node Label</Label>
              <Input id="label" value={localNode.data.label} onChange={(e) => handleChange("label", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={localNode.data.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Node Color</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={localNode.data.color || nodeDefinition?.color || "#6B7280"}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={localNode.data.color || nodeDefinition?.color || "#6B7280"}
                  onChange={(e) => handleChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label>Node Type</Label>
              <Badge variant="outline">{localNode.data.type}</Badge>
            </div>
          </TabsContent>

          <TabsContent value="parameters" className="p-4 space-y-4">
            {localNode.data.parameters && Object.keys(localNode.data.parameters).length > 0 ? (
              Object.entries(localNode.data.parameters).map(([key, value]) => (
                <div key={key}>{renderParameterField(key, value)}</div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No parameters available for this node type</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4">
            <div>
              <Label>Retry Policy</Label>
              <div className="space-y-3 mt-2">
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
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Max Attempts</Label>
                        <span className="text-sm text-gray-500">{localNode.data.config.retryPolicy.maxAttempts}</span>
                      </div>
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
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm">Backoff Factor</Label>
                        <span className="text-sm text-gray-500">{localNode.data.config.retryPolicy.backoffFactor}</span>
                      </div>
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
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Timeout (seconds)</Label>
                <span className="text-sm text-gray-500">{localNode.data.config?.timeout || 30}</span>
              </div>
              <Slider
                value={[localNode.data.config?.timeout || 30]}
                min={1}
                max={300}
                step={1}
                onValueChange={(value) => handleConfigChange("timeout", value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Enable Logging</Label>
              <Switch
                checked={localNode.data.config?.enableLogging !== false}
                onCheckedChange={(checked) => handleConfigChange("enableLogging", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Continue on Error</Label>
              <Switch
                checked={!!localNode.data.config?.continueOnError}
                onCheckedChange={(checked) => handleConfigChange("continueOnError", checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-1" />
              Duplicate
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(node.id)}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          <Info className="h-3 w-3 mr-1" />
          Node ID: {node.id}
        </div>
      </div>
    </div>
  )
}
