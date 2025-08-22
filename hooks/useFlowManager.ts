import { useCallback } from "react";
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
} from "@xyflow/react";
import { getNodeId, getPlusId } from "@/lib/nodeUtils";

type NodeType = "normal" | "conditional";

export const useFlowManager = (initialNodes: Node[], initialEdges: Edge[]) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Check if a node has no outgoing edges 
  const isLastNode = useCallback(
    (nodeId: string) => !edges.some((edge) => edge.source === nodeId),
    [edges]
  );

  // Insert a new node between source → target
  const handleInsert = (sourceId: string, targetId: string, type: NodeType) => {
    const newNodeId = getNodeId();

    if (type === "normal") {
      const newNode: Node = {
        id: newNodeId,
        position: { x: 0, y: 0 },
        data: { label: `Email ${newNodeId}` },
        type: "email",
      };

      setNodes((nds) => [...nds, newNode]);

      setEdges((eds) => [
        ...eds.filter((e) => !(e.source === sourceId && e.target === targetId)),
        { id: `e-${sourceId}-${newNodeId}`, source: sourceId, target: newNodeId, type: "conditionalSplit" },
        { id: `e-${newNodeId}-${targetId}`, source: newNodeId, target: targetId, type: "conditionalSplit" },
      ]);
    } else {
      const conditionalId = newNodeId;
      const conditionalNode: Node = {
        id: conditionalId,
        position: { x: 0, y: 0 },
        data: { label: "Conditional" },
        type: "conditional",
      };

      const noPlusId = getPlusId();
      const noPlus: Node = {
        id: noPlusId,
        position: { x: 150, y: 150 },
        data: {},
        type: "plusNode",
      };

      setNodes((nds) => [...nds, conditionalNode, noPlus]);

      setEdges((eds) => [
        ...eds.filter((e) => !(e.source === sourceId && e.target === targetId)),
        { id: `e-${sourceId}-${conditionalId}`, source: sourceId, target: conditionalId, type: "conditionalSplit" },
        {
          id: `e-${conditionalId}-${targetId}-yes`,
          source: conditionalId,
          target: targetId,
          sourceHandle: "yes",
          type: "conditionalSplit",
        },
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

  // Add new node after plusNode 
  const handleAddNode = (plusNodeId: string, type: NodeType) => {
    const plusNode = nodes.find((n) => n.id === plusNodeId);
    if (!plusNode) return;

    const newNodeId = getNodeId();

    if (type === "normal") {
      const newNode: Node = {
        id: newNodeId,
        position: { x: plusNode.position.x, y: plusNode.position.y },
        data: { label: `Node ${newNodeId}` },
        type: "email",
      };

      const newPlusId = getPlusId();
      const nextPlus: Node = {
        id: newPlusId,
        position: { x: plusNode.position.x, y: plusNode.position.y + 150 },
        data: {},
        type: "plusNode",
      };

      setNodes((nds) => nds.map((n) => (n.id === plusNodeId ? newNode : n)).concat(nextPlus));

      setEdges((eds) => {
        const updated = eds.map((e) => (e.target === plusNodeId ? { ...e, target: newNodeId } : e));
        return [...updated, { id: `e-${newNodeId}-${newPlusId}`, source: newNodeId, target: newPlusId, type: "conditionalSplit" }];
      });
    } else {
      const conditionalNode: Node = {
        id: newNodeId,
        position: { x: plusNode.position.x, y: plusNode.position.y },
        data: { label: "Conditional" },
        type: "conditional",
      };

      const leftPlusId = getPlusId();
      const rightPlusId = getPlusId();

      const leftPlus: Node = {
        id: leftPlusId,
        position: { x: plusNode.position.x - 150, y: plusNode.position.y + 150 },
        data: {},
        type: "plusNode",
      };

      const rightPlus: Node = {
        id: rightPlusId,
        position: { x: plusNode.position.x + 150, y: plusNode.position.y + 150 },
        data: {},
        type: "plusNode",
      };

      setNodes((nds) =>
        nds.map((n) => (n.id === plusNodeId ? conditionalNode : n)).concat([leftPlus, rightPlus])
      );

      setEdges((eds) => {
        const updated = eds.map((e) => (e.target === plusNodeId ? { ...e, target: newNodeId } : e));
        return [
          ...updated,
          { id: `e-${newNodeId}-${leftPlusId}`, source: newNodeId, sourceHandle: "yes", target: leftPlusId, type: "conditionalSplit" },
          { id: `e-${newNodeId}-${rightPlusId}`, source: newNodeId, sourceHandle: "no", target: rightPlusId, type: "conditionalSplit" },
        ];
      });
    }
  };

  // Handle React Flow connections 
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    handleAddNode,
    handleInsert,
    isLastNode,
    onConnect,
  };
};
