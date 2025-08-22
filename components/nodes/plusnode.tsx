"use client";

import { Handle, Position } from "@xyflow/react";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlusNodeProps {
  id: string;
  onAdd: (id: string, type: "normal" | "conditional") => void;
}

export default function PlusNode({ id, onAdd }: PlusNodeProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-white border border-gray-300 rounded-md p-2 shadow-md cursor-pointer hover:bg-gray-100 flex items-center justify-center">
            <Plus size={16} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="bottom" className="w-40">
          <DropdownMenuItem onClick={() => onAdd(id, "normal")}>
            ➕ Add Normal Node
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAdd(id, "conditional")}>
            🔀 Add Conditional Node
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
