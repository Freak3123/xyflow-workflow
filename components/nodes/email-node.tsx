"use client"

import { Handle, Position } from "@xyflow/react"
import { Button } from "@/components/ui/button"

interface EmailNodeProps {
  data: {
    label: string
    // onNodeClick: (nodeType: "conditionalSplit" | "email", nodeId: string) => void
  }
  id: string
}

export default function EmailNode({ data, id }: EmailNodeProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-4 min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white" />

      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-900">Email</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        //onClick={() => data.onNodeClick("email", id)}
      >
        Set Up Email
      </Button>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </div>
  )
}
