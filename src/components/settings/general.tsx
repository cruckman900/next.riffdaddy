import { Box, Divider, List, ListItem, ListItemText, Switch, Typography } from "@mui/material";

export default function GeneralSettings() {
    return (
        <Box>
            <Typography variant="h6" gutterBottom color="text.primary">
                General
            </Typography>

            <Divider sx={{ my: 2 }} />

            <List>
                <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText primary="Dark Mode" />
                    <Switch />
                </ListItem>
                <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText primary="Autosave" />
                    <Switch defaultChecked />
                </ListItem>
            </List>
        </Box>
    )
}
