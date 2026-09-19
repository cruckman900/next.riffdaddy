import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import GeneralSettings from "./settings/general";
import { ScoreSettings } from "./settings/score";
import { useTheme } from "@mui/material/styles";

export default function Settings() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const cardSx = {
        flexShrink: 0,
        width: isMobile ? "100%" : "30%",
        minWidth: isMobile ? 0 : 320,
        maxWidth: 380,
        overflowY: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: `0 0 18px ${theme.palette.accent.main}1a`,
        backgroundColor: theme.palette.background.paper,
        p: 2,
    } as const

    return (
        <Box sx={{ p: 2, height: "100%", overflowY: "auto", backgroundColor: theme.palette.background.default }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: theme.palette.accent.main, fontWeight: 700, textShadow: `0 0 10px ${theme.palette.accent.main}66` }}
            >
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
                <Box sx={cardSx}>
                    <GeneralSettings />
                </Box>

                <Box sx={cardSx}>
                    <ScoreSettings />
                </Box>
            </Stack>
        </Box>
    );
}
