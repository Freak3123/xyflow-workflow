"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { getNodeTypes, edgeTypes } from "@/components/nodeTypes";
import { getNodeId, getPlusId } from "@/lib/nodeUtils";
import { Sidebar } from "@/components/sidebar";

const initialNodes: Node[] = [
  {
    id: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
    type: "start",
  },
  { id: "plus1", position: { x: 0, y: 150 }, data: {}, type: "plusNode" },
];

const initialEdges: Edge[] = [
  {
    id: "estart-plus1",
    source: "start",
    target: "plus1",
    type: "conditionalSplit",
  },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<"conditionalSplit" | "email" | null>(null);
  const [sidebarData, setSidebarData] = useState<any>(null);

  const isLastNode = useCallback(
    (nodeId: string) => {
      return !edges.some((edge) => edge.source === nodeId);
    },
    [edges]
  );

  const handleInsert = (
  sourceId: string,
  targetId: string,
  type: "normal" | "conditional"
) => {
  const plusNode = nodes.find((n) => n.id === targetId);
    if (!plusNode) return;
  const newNodeId = getNodeId();

  if (type === "normal") {
    // Create a new email node
    const newNode = {
      id: newNodeId,
      position: { x: plusNode.position.x + 200, y: plusNode.position.y - 100 },
      data: { label: `Email ${newNodeId}` },
      type: "email",
    };

    setNodes((nds) => [...nds, newNode]);

    setEdges((eds) => [
      // Remove the old edge 
      ...eds.filter((e) => !(e.source === sourceId && e.target === targetId)),

      // source → email
      {
        id: `e-${sourceId}-${newNodeId}`,
        source: sourceId,
        target: newNodeId,
        type: "conditionalSplit",
      },

      // email → target
      {
        id: `e-${newNodeId}-${targetId}`,
        source: newNodeId,
        target: targetId,
        type: "conditionalSplit",
      },
    ]);
  } else {
    // Conditional node
    const conditionalId = newNodeId;
    const conditionalNode = {
      id: conditionalId,
      position: { x: plusNode.position.x + 200, y: plusNode.position.y - 100 },
      data: { label: "Conditional" },
      type: "conditional",
    };

    const noPlusId = getPlusId();
    const noPlus = {
      id: noPlusId,
      position: { x: plusNode.position.x + 400 , y: plusNode.position.y + 100 },
      data: {},
      type: "plusNode",
    };

    setNodes((nds) => [...nds, conditionalNode, noPlus]);

    setEdges((eds) => [
      // Remove old edge (source → target)
      ...eds.filter((e) => !(e.source === sourceId && e.target === targetId)),

      // source → conditional
      {
        id: `e-${sourceId}-${conditionalId}`,
        source: sourceId,
        target: conditionalId,
        type: "conditionalSplit",
      },

      // conditional (yes) → target
      {
        id: `e-${conditionalId}-${targetId}-yes`,
        source: conditionalId,
        target: targetId,
        sourceHandle: "yes",
        type: "conditionalSplit",
      },

      // conditional (no) → plus node
      {
        id: `e-${conditionalId}-${noPlusId}-no`,
        source: conditionalId,
        target: noPlusId,
        sourceHandle: "no",
        type: "conditionalSplit",
      },
    ]);
  }
};

  const handleAddNode = (
    plusNodeId: string,
    type: "normal" | "conditional"
  ) => {
    const plusNode = nodes.find((n) => n.id === plusNodeId);
    if (!plusNode) return;

    const newNodeId = getNodeId();

    if (type === "normal") {
      const newNode = {
        id: newNodeId,
        position: { x: plusNode.position.x, y: plusNode.position.y },
        data: { label: `Node ${newNodeId}` },
        type: "email",
      };

      const newPlusId = getPlusId();
      const nextPlus = {
        id: newPlusId,
        position: { x: plusNode.position.x, y: plusNode.position.y + 150 },
        data: {},
        type: "plusNode",
      };

      setNodes((nds) =>
        nds.map((n) => (n.id === plusNodeId ? newNode : n)).concat(nextPlus)
      );

      setEdges((eds) => {
        const updated = eds.map((e) =>
          e.target === plusNodeId ? { ...e, target: newNodeId } : e
        );
        return [
          ...updated,
          {
            id: `e-${newNodeId}-${newPlusId}`,
            source: newNodeId,
            target: newPlusId,
            type: "conditionalSplit",
          },
        ];
      });
    } else {
      const conditionalNode = {
        id: newNodeId,
        position: { x: plusNode.position.x, y: plusNode.position.y },
        data: { label: "Conditional" },
        type: "conditional",
      };

      const leftPlusId = getPlusId();
      const rightPlusId = getPlusId();

      const leftPlus = {
        id: leftPlusId,
        position: {
          x: plusNode.position.x - 150,
          y: plusNode.position.y + 150,
        },
        data: {},
        type: "plusNode",
      };

      const rightPlus = {
        id: rightPlusId,
        position: {
          x: plusNode.position.x + 150,
          y: plusNode.position.y + 150,
        },
        data: {},
        type: "plusNode",
      };

      setNodes((nds) =>
        nds
          .map((n) => (n.id === plusNodeId ? conditionalNode : n))
          .concat([leftPlus, rightPlus])
      );

      setEdges((eds) => {
        const updated = eds.map((e) =>
          e.target === plusNodeId ? { ...e, target: newNodeId } : e
        );
        return [
          ...updated,
          {
            id: `e-${newNodeId}-${leftPlusId}`,
            source: newNodeId,
            sourceHandle: "yes",
            target: leftPlusId,
            type: "conditionalSplit",
          },
          {
            id: `e-${newNodeId}-${rightPlusId}`,
            source: newNodeId,
            sourceHandle: "no",
            target: rightPlusId,
            type: "conditionalSplit",
          },
        ];
      });
    }
  };

  const handleNodeClick = (node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedNodeType(node.type === "conditional" ? "conditionalSplit" : node.type === "email" ? "email" : null);
    setSidebarData(node.data);
    setSidebarOpen(true);
  };

  const handleSidebarSave = (nodeId: string, config: any) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...config } } : n))
    );
    setSidebarOpen(false);
  };

  const nodeTypes = getNodeTypes(handleAddNode);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges.map((e) => ({
          ...e,
          data: { ...e.data, onAdd: handleAddNode, onInsert: handleInsert, isLastNode },
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onNodeClick={(_, node) => handleNodeClick(node)}
      />

      {selectedNodeId && selectedNodeType && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          nodeType={selectedNodeType}
          nodeId={selectedNodeId}
          onSave={handleSidebarSave}
          initialData={sidebarData}
        />
      )}

    </div>
  );
}
