import { Box, Divider, Typography } from "@mui/material";
import { ThemeChooser } from "../themes/ThemeChooser";
import { useTheme } from "@mui/material";

export default function GeneralSettings() {
    const theme = useTheme()
    return (
        <Box>
            <Box>
                <Typography variant="h6" gutterBottom color={theme.palette.text.primary}>
                    General
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" color={theme.palette.text.primary}>
                    Theme
                </Typography>

                <ThemeChooser />
            </Box>
        </Box>
    )
}
