"use client";

import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlusDropdownProps {
  edgeId: string;
  sourceId: string;
  targetId: string;
  onInsert: (sourceId: string, targetId: string, type: "normal" | "conditional") => void;
}

export default function PlusDropdown({ edgeId, sourceId, targetId, onInsert }: PlusDropdownProps) {
  const handleClick = (type: "normal" | "conditional") => {
    onInsert(sourceId, targetId, type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="bg-white border border-gray-300 rounded-full p-1 shadow-sm cursor-pointer hover:bg-gray-100 flex items-center justify-center"
        >
          <Plus size={14} className="text-gray-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" side="bottom" className="w-48">
        <DropdownMenuItem onClick={() => handleClick("normal")}>
          ➕ Add Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("conditional")}>
          🔀 Add Conditional Logic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
