import { TOOL_REGISTRY, TOOL_ORDER } from "@/tools/registry";
import { ToolButton } from "./ToolButton";
import { useTheme } from "@mui/material/styles"

interface ToolRailProps {
    activeToolId: string;
    setActiveTool: (id: string) => void;
}

export function ToolRail({ activeToolId, setActiveTool }: ToolRailProps) {
    const theme = useTheme()

    return (
        <div
            className="print:hidden"
            style={{
                width: "60px",
                height: "100%",
                background: theme.palette.muted.main,
                borderRight: `1px solid ${theme.palette.divider}`,
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
