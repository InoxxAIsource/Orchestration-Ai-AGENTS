"use client"

import { useState, useCallback, useEffect } from "react"
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ControlButton,
  MarkerType,
} from "reactflow"
import "reactflow/dist/style.css"
import { FloatingEdge } from "./FloatingEdge"
import { CustomNode } from "./CustomNode"
import { CustomConnectionLine } from "./CustomConnectionLine"
import { initialNodes, initialEdges } from "./initial-elements"
import { v4 as uuidv4 } from "uuid"
import { InputNode } from "./InputNode"
import { OutputNode } from "./OutputNode"
import { CodeNode } from "./CodeNode"
import { LLMNode } from "./LLMNode"
import { ChainNode } from "./ChainNode"
import { AgentNode } from "./AgentNode"
import { ToolNode } from "./ToolNode"
import { VectorDBNode } from "./VectorDBNode"
import { MemoryNode } from "./MemoryNode"
import { TextNode } from "./TextNode"
import { PromptNode } from "./PromptNode"
import { JsonNode } from "./JsonNode"
import { FunctionNode } from "./FunctionNode"
import { FileNode } from "./FileNode"
import { WebpageNode } from "./WebpageNode"
import { APIAgentNode } from "./APIAgentNode"
import { SearchNode } from "./SearchNode"
import { DecisionNode } from "./DecisionNode"
import { HttpNode } from "./HttpNode"
import { EmailNode } from "./EmailNode"
import { IfElseNode } from "./IfElseNode"
import { LoopNode } from "./LoopNode"
import { TimerNode } from "./TimerNode"
import { showNotification } from "../utils/helpers"
import { useTheme } from "next-themes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowsRotate, faPlay, faSave, faStop } from "@fortawesome/free-solid-svg-icons"
import { useDisclosure } from "@mantine/hooks"
import { useReactFlow } from "reactflow"

const nodeTypes = {
  customNode: CustomNode,
  inputNode: InputNode,
  outputNode: OutputNode,
  codeNode: CodeNode,
  llmNode: LLMNode,
  chainNode: ChainNode,
  agentNode: AgentNode,
  toolNode: ToolNode,
  vectorDBNode: VectorDBNode,
  memoryNode: MemoryNode,
  textNode: TextNode,
  promptNode: PromptNode,
  jsonNode: JsonNode,
  functionNode: FunctionNode,
  fileNode: FileNode,
  webpageNode: WebpageNode,
  apiAgentNode: APIAgentNode,
  searchNode: SearchNode,
  decisionNode: DecisionNode,
  httpNode: HttpNode,
  emailNode: EmailNode,
  ifElseNode: IfElseNode,
  loopNode: LoopNode,
  timerNode: TimerNode,
}

const edgeTypes = {
  floating: FloatingEdge,
}

const AgentWorkflowBuilder = () => {
  const { getNodes } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const { theme } = useTheme()
  const [opened, { open, close }] = useDisclosure(false)
  const [workflowName, setWorkflowName] = useState("")

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "floating",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: theme === "dark" ? "#fff" : "#000",
            },
            style: {
              strokeWidth: 2,
              stroke: theme === "dark" ? "#fff" : "#000",
            },
          },
          eds,
        ),
      ),
    [setEdges, theme],
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const handleNodeRename = (nodeId, newLabel) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newLabel } }
        }
        return node
      }),
    )
  }

  const handleDuplicateNode = (node) => {
    const id = uuidv4()
    const newNode = {
      ...node,
      id,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      data: { ...node.data, label: `${node.data.label} (copy)` },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  useEffect(() => {
    const handleUpdateNode = (event: CustomEvent) => {
      setNodes((nds) => nds.map((n) => (n.id === event.detail.id ? { ...n, data: event.detail.data } : n)))
    }

    const handleDeleteNode = (event: CustomEvent) => {
      setNodes((nds) => nds.filter((n) => n.id !== event.detail.id))
      setEdges((eds) => eds.filter((e) => e.source !== event.detail.id && e.target !== event.detail.id))
      if (selectedNode?.id === event.detail.id) {
        setSelectedNode(null)
      }
    }

    const handleEditNode = (event: CustomEvent) => {
      const nodeToEdit = nodes.find((n) => n.id === event.detail.id)
      if (nodeToEdit) {
        setSelectedNode(nodeToEdit)
      }
    }

    window.addEventListener("updateNode", handleUpdateNode as EventListener)
    window.addEventListener("deleteNode", handleDeleteNode as EventListener)
    window.addEventListener("editNode", handleEditNode as EventListener)

    return () => {
      window.removeEventListener("updateNode", handleUpdateNode as EventListener)
      window.removeEventListener("deleteNode", handleDeleteNode as EventListener)
      window.removeEventListener("editNode", handleEditNode as EventListener)
    }
  }, [nodes, setNodes, setEdges, selectedNode])

  const executeWorkflow = useCallback(async () => {
    if (nodes.length === 0) {
      showNotification("error", "No nodes to execute")
      return
    }
    setIsExecuting(true)
    showNotification("info", "Starting workflow execution...")

    // Simulate workflow execution
    for (let i = 0; i < nodes.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      // Update each node as "executed"
      setNodes((nds) =>
        nds.map((n, index) =>
          index === i
            ? {
                ...n,
                data: {
                  ...n.data,
                  lastRun: new Date().toISOString(),
                  executions: (n.data.executions || 0) + 1,
                  outputData: { result: `Executed ${n.data.label}` },
                },
              }
            : n,
        ),
      )
    }

    setIsExecuting(false)
    showNotification("success", "Workflow executed successfully")
  }, [nodes, setNodes])

  const saveWorkflow = useCallback(() => {
    const workflowData = {
      nodes: nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          // Remove any function references for serialization
          onRename: undefined,
          onDelete: undefined,
          onEdit: undefined,
          onDuplicate: undefined,
        },
      })),
      edges,
    }

    // Save to localStorage for persistence in demo
    localStorage.setItem("workflow", JSON.stringify(workflowData))
    console.log("Workflow saved locally:", workflowData)
    showNotification("success", "Workflow saved locally")
  }, [nodes, edges])

  const resetWorkflow = () => {
    setNodes(initialNodes)
    setEdges(initialEdges)
    setSelectedNode(null)
    localStorage.removeItem("workflow")
    showNotification("success", "Workflow reset to default")
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        connectionLineComponent={CustomConnectionLine}
        fitView
        attributionPosition="top-right"
      >
        <Controls>
          <ControlButton onClick={resetWorkflow} title="Reset Workflow">
            <FontAwesomeIcon icon={faArrowsRotate} />
          </ControlButton>
          <ControlButton onClick={executeWorkflow} title="Run Workflow" disabled={isExecuting}>
            <FontAwesomeIcon icon={isExecuting ? faStop : faPlay} />
          </ControlButton>
          <ControlButton onClick={saveWorkflow} title="Save Workflow">
            <FontAwesomeIcon icon={faSave} />
          </ControlButton>
        </Controls>
        <Background variant="dots" gap={20} size={1} />
      </ReactFlow>
    </div>
  )
}

export default AgentWorkflowBuilder
