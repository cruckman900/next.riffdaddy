import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import GeneralSettings from "./settings/general";
import { ScoreSettings } from "./settings/score";
import { useTheme } from "@mui/material/styles";

export default function Settings() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={{ p: 2, height: "100%", overflowY: "auto" }}>
            <Typography variant="h4" gutterBottom color="text.primary">
                Settings
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
                Changes are saved automatically.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack
                direction={isMobile ? "column" : "row"}
                sx={{
                    width: "100%",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        width: isMobile ? "100%" : "30%",
                        minWidth: isMobile ? 0 : 320,
                        maxWidth: 380,
                        overflowY: "auto",
                        border: "1px solid #2a2f35",
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                    }}
                >
                    <GeneralSettings />
                </Box>

                <Box
                    sx={{
                        flexShrink: 0,
                        width: isMobile ? "100%" : "30%",
                        minWidth: isMobile ? 0 : 320,
                        maxWidth: 380,
                        overflowY: "auto",
                        border: "1px solid #2a2f35",
                        backgroundColor: theme.palette.background.paper,
                        p: 1,
                    }}
                >
                    <ScoreSettings />
                </Box>
            </Stack>
        </Box>
    );
}
