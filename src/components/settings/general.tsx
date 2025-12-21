import { Box, Divider, Typography } from "@mui/material";
import { ThemeChooser } from "../themes/ThemeChooser";

export default function GeneralSettings() {
    return (
        <Box>
            <Box>
                <Typography variant="h6" gutterBottom color="text.primary">
                    General
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" color="text.primary">
                    Theme
                </Typography>

                <ThemeChooser />
            </Box>
        </Box>
    )
}
