"use client"

import { useState } from "react"
import { TOOLS } from "@/types/agent"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ToolConfigurationProps {
  toolId: string
  onClose: () => void
}

export function ToolConfiguration({ toolId, onClose }: ToolConfigurationProps) {
  const tool = TOOLS.find((t) => t.id === toolId)
  const [apiKey, setApiKey] = useState("")
  const [rateLimit, setRateLimit] = useState(tool?.config.rateLimit || 10)

  if (!tool) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Configure {tool.name}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">{tool.description}</p>

        {tool.config.requiresSetup && (
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={`Enter ${tool.name} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            {tool.config.authType === "oauth" && (
              <Button variant="outline" size="sm" className="mt-2">
                Connect via OAuth
              </Button>
            )}
          </div>
        )}

        {tool.config.rateLimit && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="rateLimit">Rate Limit</Label>
              <span className="text-sm text-gray-500">{rateLimit} req/min</span>
            </div>
            <Slider
              id="rateLimit"
              min={1}
              max={tool.config.rateLimit * 2}
              step={1}
              value={[rateLimit]}
              onValueChange={(value) => setRateLimit(value[0])}
            />
          </div>
        )}

        <div className="pt-4">
          <Button className="w-full">Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  )
}
