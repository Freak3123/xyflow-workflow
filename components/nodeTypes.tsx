"use client";

import StartNode from "@/components/nodes/start-node";
import EmailNode from "@/components/nodes/email-node";
import ConditionalSplitNode from "@/components/nodes/conditional-split-node";
import PlusNode from "@/components/nodes/plusnode";
import ConditionalEdge from "@/components/edges/conditionalEdge";

export const getNodeTypes = (handleAddNode: any) => ({
  start: (props: any) => <StartNode {...props} />,
  email: (props: any) => <EmailNode {...props} />,
  conditional: (props: any) => <ConditionalSplitNode {...props} />,
  plusNode: (props: any) => <PlusNode {...props} onAdd={handleAddNode} />,
});

export const edgeTypes = {
  conditionalSplit: ConditionalEdge,
};