import { Box, Divider, Typography } from "@mui/material";

export default function GeneralSettings() {
    return (
        <Box>
            <Box>
                <Typography variant="h6" gutterBottom color="text.primary">
                    General
                </Typography>

                <Divider sx={{ my: 2 }} />
            </Box>
        </Box>
    )
}
