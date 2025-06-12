"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
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
  type Node,
  type Edge,
  type Connection,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import EnhancedNode from "./enhanced-node"
import NodePalette from "./node-palette"
import NodeConfigPanel from "./node-config-panel"
import { NODE_CATEGORIES } from "@/lib/node-definitions"
import {
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  EyeOff,
  Play,
  Square,
  Zap,
  Settings,
  Search,
} from "lucide-react"

export default function OrchestrationBuilder() {
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showMinimap, setShowMinimap] = useState(true)

  const nodeTypes = {
    enhanced: EnhancedNode,
  }

  const onDragStart = useCallback((event: React.DragEvent<HTMLDivElement>, nodeData: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeData))
    event.dataTransfer.effectAllowed = "move"
  }, [])

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = (reactFlowWrapper.current as any).getBoundingClientRect()
      const nodeData = JSON.parse(event.dataTransfer.getData("application/reactflow"))

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode: Node = {
        id: `${nodeData.type}-${Date.now()}`,
        type: "enhanced",
        position,
        data: {
          ...nodeData,
          inputData: {},
          outputData: {},
        },
        parentId: undefined,
        extent: undefined,
        expandParent: undefined,
        positionAbsolute: undefined,
        dragging: undefined,
        selected: undefined,
        zIndex: undefined,
        width: undefined,
        height: undefined,
      }

      setNodes((nds) => [...nds, newNode])
    },
    [setNodes],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `${params.source}-${params.target}-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges],
  )

  const handleNodeUpdate = useCallback(
    (updatedNode: Node) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)))
    },
    [setNodes],
  )

  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId))
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId))
      setSelectedNode(null)
    },
    [setNodes, setEdges],
  )

  const handleNodeDuplicate = useCallback(
    (node: Node) => {
      const duplicatedNode: Node = {
        ...node,
        id: `${node.data.type}-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        parentId: undefined,
      }
      setNodes((nds) => [...nds, duplicatedNode])
    },
    [setNodes],
  )

  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true)
    setTimeout(() => {
      setIsExecuting(false)
    }, 3000)
  }, [])

  const stopExecution = useCallback(() => {
    setIsExecuting(false)
  }, [])

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Workflow Builder
            </h2>
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-2 py-1 text-xs rounded ${
                  !selectedCategory ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {Object.entries(NODE_CATEGORIES).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                  className={`px-2 py-1 text-xs rounded ${
                    selectedCategory === key
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          <NodePalette onDragStart={onDragStart} searchTerm={searchTerm} selectedCategory={selectedCategory} />
        </div>
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
            connectionLineType="smoothstep"
            connectionLineStyle={{
              stroke: "#3b82f6",
              strokeWidth: 2,
              strokeDasharray: "5,5",
            }}
            defaultEdgeOptions={{
              type: "smoothstep",
              animated: true,
              style: { stroke: "#3b82f6", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#3b82f6",
              },
            }}
            snapToGrid={true}
            snapGrid={[15, 15]}
          >
            <Panel
              position="top-center"
              className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200"
            >
              <button
                onClick={executeWorkflow}
                disabled={isExecuting || nodes.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium ${
                  isExecuting
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Execute
                  </>
                )}
              </button>
              {isExecuting && (
                <button
                  onClick={stopExecution}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-medium"
                >
                  <Square className="w-4 h-4" />
                  Stop
                </button>
              )}
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button className="p-2 hover:bg-gray-100 rounded" title="Save Workflow">
                <Save className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded" title="Workflow Settings">
                <Settings className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <span className="text-sm text-gray-600">
                {nodes.length} nodes, {edges.length} connections
              </span>
            </Panel>

            <Panel position="top-right" className="flex flex-col gap-2">
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Fit View">
                  <Maximize className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMinimap(!showMinimap)}
                  className={`p-2 rounded ${showMinimap ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`}
                  title="Toggle Minimap"
                >
                  {showMinimap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex gap-1">
                <button className="p-2 hover:bg-gray-100 rounded" title="Undo">
                  <Undo className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Redo">
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </Panel>

            {isExecuting && (
              <Panel position="bottom-center" className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <div className="font-medium text-sm">Executing Workflow</div>
                    <div className="text-xs text-gray-600">Processing nodes...</div>
                  </div>
                  <div className="ml-4">
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full w-1/3 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {nodes.length > 0 && (
              <Panel
                position="bottom-left"
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 max-w-xs"
              >
                <div className="text-sm font-medium text-gray-900 mb-2">Connection Guide</div>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span>Gray dots: Inputs (top/left)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Blue dots: Outputs (bottom/right)</span>
                  </div>
                  <div className="text-gray-500 italic">Drag from output to input to connect nodes</div>
                </div>
              </Panel>
            )}

            <Background color="#aaa" gap={16} />
            <Controls />
            {showMinimap && <MiniMap />}
          </ReactFlow>
        </div>

        {selectedNode && (
          <div className="w-96 bg-white border-l border-gray-200">
            <NodeConfigPanel
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onUpdate={handleNodeUpdate}
              onDelete={handleNodeDelete}
              onDuplicate={handleNodeDuplicate}
            />
          </div>
        )}

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
              <p className="text-gray-600 max-w-sm">
                Drag and drop nodes from the left panel to create your automation workflow. Connect nodes to define the
                flow of data and execution.
              </p>
            </div>
          </div>
        )}
      </div>
    </ReactFlowProvider>
  )
}
