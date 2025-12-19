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
                height: "100%",
                background: "#111111",
                borderRight: "1px solid #2a2f35",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "12px",
                gap: "12px",
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
