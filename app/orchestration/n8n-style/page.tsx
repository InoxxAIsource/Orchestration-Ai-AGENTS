"use client"

import type React from "react"

import { useCallback, useState, useRef } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Save, Trash2, Undo, Redo, Plus, Maximize, ZoomIn, ZoomOut } from "lucide-react"
import CustomNode from "@/components/orchestration/custom-node"
import N8nNodePalette from "@/components/orchestration/n8n-node-palette"
import EnhancedNodeConfig from "@/components/orchestration/enhanced-node-config"
import type { NodeDefinition } from "@/lib/node-definitions"

// Define node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
}

type HistoryItem = {
  nodes: Node[]
  edges: Edge[]
}

export default function N8nStyleOrchestrationBuilder() {
  return (
    <ReactFlowProvider>
      <N8nOrchestrationBuilderContent />
    </ReactFlowProvider>
  )
}

function N8nOrchestrationBuilderContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { fitView, zoomIn, zoomOut } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [name, setName] = useState("New Workflow")
  const [isSaving, setIsSaving] = useState(false)

  const history = useRef<HistoryItem[]>([])
  const historyIndex = useRef(-1)

  const pushToHistory = useCallback(
    (currentNodes?: Node[], currentEdges?: Edge[]) => {
      const nodesToSave = currentNodes || nodes
      const edgesToSave = currentEdges || edges

      history.current = history.current.slice(0, historyIndex.current + 1)
      history.current.push({
        nodes: JSON.parse(JSON.stringify(nodesToSave)),
        edges: JSON.parse(JSON.stringify(edgesToSave)),
      })
      historyIndex.current = history.current.length - 1
    },
    [nodes, edges],
  )

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current--
      const { nodes: prevNodes, edges: prevEdges } = history.current[historyIndex.current]
      setNodes(prevNodes)
      setEdges(prevEdges)
      toast.info("Undone")
    }
  }, [setNodes, setEdges])

  const redo = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++
      const { nodes: nextNodes, edges: nextEdges } = history.current[historyIndex.current]
      setNodes(nextNodes)
      setEdges(nextEdges)
      toast.info("Redone")
    }
  }, [setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent self-connections
      if (params.source === params.target) {
        toast.error("Cannot connect a node to itself")
        return
      }

      // Check if connection already exists
      const existingEdge = edges.find((edge) => edge.source === params.source && edge.target === params.target)
      if (existingEdge) {
        toast.error("Connection already exists")
        return
      }

      const newEdge = {
        ...params,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      setTimeout(() => pushToHistory(), 100)
    },
    [setEdges, pushToHistory, edges],
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
      setSelectedNode(null)
      pushToHistory()
      toast.success("Node deleted")
    },
    [setNodes, setEdges, pushToHistory],
  )

  const handleNodeRename = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n)))
      pushToHistory()
      toast.success("Node renamed")
    },
    [setNodes, pushToHistory],
  )

  const handleNodeDuplicate = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId)
      if (!nodeToDuplicate) return

      const duplicatedNode = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.data.type}-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 50,
          y: nodeToDuplicate.position.y + 50,
        },
      }
      setNodes((nds) => [...nds, duplicatedNode])
      pushToHistory()
      toast.success("Node duplicated")
    },
    [nodes, setNodes, pushToHistory],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const nodeDefString = event.dataTransfer.getData("application/reactflow")

      if (!nodeDefString) return

      try {
        const nodeDefinition: NodeDefinition = JSON.parse(nodeDefString)

        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        }

        const newNode: Node = {
          id: `${nodeDefinition.type}-${Date.now()}`,
          type: "custom", // Always use custom node type for n8n style
          position,
          data: {
            ...nodeDefinition.defaultData,
            color: nodeDefinition.color,
            onDelete: handleNodeDelete,
            onRename: handleNodeRename,
            onDuplicate: handleNodeDuplicate,
          },
        }

        setNodes((nds) => nds.concat(newNode))
        setTimeout(() => pushToHistory(), 100)
        toast.success(`Added ${nodeDefinition.defaultData.label} to canvas`)
      } catch (error) {
        console.error("Failed to parse node definition:", error)
        toast.error("Failed to add node")
      }
    },
    [setNodes, pushToHistory, handleNodeDelete, handleNodeRename, handleNodeDuplicate],
  )

  const handleNodeUpdate = useCallback(
    (updatedNode: Node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === updatedNode.id
            ? {
                ...updatedNode,
                data: {
                  ...updatedNode.data,
                  onDelete: handleNodeDelete,
                  onRename: handleNodeRename,
                  onDuplicate: handleNodeDuplicate,
                },
              }
            : n,
        ),
      )
      setSelectedNode(null)
      pushToHistory()
      toast.success("Node updated")
    },
    [setNodes, pushToHistory, handleNodeDelete, handleNodeRename, handleNodeDuplicate],
  )

  const clearCanvas = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      if (confirm("Are you sure you want to clear the canvas?")) {
        setNodes([])
        setEdges([])
        pushToHistory([], [])
        toast.success("Canvas cleared")
      }
    }
  }, [nodes.length, edges.length, setNodes, setEdges, pushToHistory])

  const createNewWorkflow = useCallback(() => {
    setName("New Workflow")
    setNodes([])
    setEdges([])
    history.current = []
    historyIndex.current = -1
    toast.success("Created new workflow")
  }, [setNodes, setEdges])

  const handleSave = useCallback(() => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      toast.success("Workflow saved successfully")
      setIsSaving(false)
    }, 1000)
  }, [])

  const onDragStart = (event: React.DragEvent, nodeDefinition: NodeDefinition) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeDefinition))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Node Palette */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold mb-2">n8n-Style Workflow</h2>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop nodes to create your workflow with four-connector nodes
          </p>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={createNewWorkflow}>
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={clearCanvas}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Node Palette */}
        <N8nNodePalette onDragStart={onDragStart} />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
          className="bg-gray-50"
          connectionLineType="smoothstep"
          defaultEdgeOptions={{
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          }}
        >
          <Panel position="top-right" className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex.current <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex.current >= history.current.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => zoomIn()}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => zoomOut()}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => fitView()}>
              <Maximize className="w-4 h-4" />
            </Button>
          </Panel>
          <MiniMap className="bg-white" nodeColor="#e2e8f0" />
          <Controls className="bg-white" />
          <Background color="#f1f5f9" gap={20} />
        </ReactFlow>
      </div>

      {/* Right Sidebar - Node Configuration */}
      {selectedNode && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <EnhancedNodeConfig
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
            onDuplicate={(node) => handleNodeDuplicate(node.id)}
          />
        </div>
      )}
    </div>
  )
}
