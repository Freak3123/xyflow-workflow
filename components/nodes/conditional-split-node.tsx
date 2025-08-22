"use client"

import { Handle, Position } from "@xyflow/react"
import { Button } from "@/components/ui/button"

interface ConditionalSplitNodeProps {
  data: {
    label: string
    //onNodeClick: (nodeType: "conditionalSplit" | "email", nodeId: string) => void
  }
  id: string
}

export default function ConditionalSplitNode({ data, id }: ConditionalSplitNodeProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 min-w-[200px]">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2
                 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006
                 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21
                 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-900">
          Conditional Split
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        //onClick={() => data.onNodeClick("conditionalSplit", id)}
      >
        Set up conditional split
      </Button>

      <div className="flex justify-between mt-4">
        <Handle
          type="source"
          position={Position.Bottom}
          id="yes"
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="no"
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </div>
    </div>
  )
}
