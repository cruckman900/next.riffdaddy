import { TOOL_REGISTRY, TOOL_ORDER } from "@/tools/registry";
import { ToolButton } from "./ToolButton";

interface ToolRailProps {
    activeToolId: string;
    setActiveTool: (id: string) => void;
}

export function ToolRail({ activeToolId, setActiveTool }: ToolRailProps) {
    return (
        <div
            style={{
                width: "60px",
                background: "#1a1d21",
                borderRight: "1px solid #2a2f35",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "12px",
                gap: "12px",
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
            }}
        >
            {TOOL_ORDER.map((id) => {
                const tool = TOOL_REGISTRY[id];
                const Icon = tool.icon;

                return (
                    <ToolButton
                        key={id}
                        label={tool.label}
                        active={activeToolId === id}
                        onClick={() => setActiveTool(id)}
                    >
                        {Icon}
                    </ToolButton>
                );
            })}
        </div>
    );
}
