import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  EdgeProps,
} from "@xyflow/react";
import PlusDropdown from "@/components/plusDropdown";

interface ConditionalEdgeData {
  isLastNode?: (nodeId: string) => boolean;
  onInsert?: (sourceId: string, targetId: string, type: "normal" | "conditional") => void;
}

export default function ConditionalEdge(props: EdgeProps & { data?: ConditionalEdgeData }) {
  const {
    id,
    data,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceHandleId,
    target,
  } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isYes = sourceHandleId === "yes";
  const isNo = sourceHandleId === "no";
  const label = isYes ? "Yes" : isNo ? "No" : "";

  const textColor = isYes ? "text-green-600" : isNo ? "text-red-600" : "";
  const bgColor = isYes ? "bg-green-100" : isNo ? "bg-red-100" : "";
  const isLastNode = data?.isLastNode?.(target);

  return (
    <>
      <BaseEdge path={edgePath} />
      <EdgeLabelRenderer>
        <div
          className={`nodrag nopan absolute px-2 py-0.5 text-[10px] font-normal rounded-full ${textColor} ${bgColor}`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {label}
        </div>
        {!isLastNode && (
          <div
            className="nodrag nopan absolute pointer-events-auto"
            style={{
              transform: `translate(-50%, -100%) translate(${targetX}px, ${
                targetY - 10
              }px)`,
            }}
          >
            <PlusDropdown
              edgeId={id}
              sourceId={props.source}
              targetId={target}
              onInsert={(sourceId, targetId, type) =>
                data?.onInsert?.(sourceId, targetId, type)
              }
            />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
