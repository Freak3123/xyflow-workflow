import { Handle, Position } from "@xyflow/react"

export default function StartNode() {
  return (
    <div className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
      <div className="text-sm font-medium text-gray-900">Start</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </div>
  )
}
