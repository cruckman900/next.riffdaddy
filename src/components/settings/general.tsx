import { Box, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ThemeChooser } from "../themes/ThemeChooser";

export default function GeneralSettings() {
    const theme = useTheme();

    return (
        <Box>
            <Box>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: theme.palette.accent.main, fontWeight: 700, textShadow: `0 0 8px ${theme.palette.accent.main}55` }}
                >
                    General
                </Typography>

                <Divider sx={{ my: 2 }} />

                <ThemeChooser />
            </Box>
        </Box>
    )
}
