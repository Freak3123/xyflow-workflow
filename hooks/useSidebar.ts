import { useState } from "react";
import { type Node } from "@xyflow/react";

export const useSidebar = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedNodeType, setSelectedNodeType] = useState<"conditionalSplit" | "email" | null>(null);
  const [sidebarData, setSidebarData] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = (node: Node) => {
    setSelectedNodeId(node.id);
    setSelectedNodeType(node.type === "conditional" ? "conditionalSplit" : node.type === "email" ? "email" : null);
    setSidebarData(node.data);
    setIsOpen(true);
  };

  const saveSidebar = (nodeId: string, config: any, setNodes: any) => {
    setNodes((nds: Node[]) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...config } } : n)));
    setIsOpen(false);
  };

  return { selectedNodeId, selectedNodeType, sidebarData, isOpen, setIsOpen, openSidebar, saveSidebar };
};
