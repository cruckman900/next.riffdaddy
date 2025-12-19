'use client'

import { Box, Typography, Divider } from '@mui/material'

export default function AboutPage() {
    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                gap: 3,
                bgcolor: 'background.paper',
            }}
        >
            <Typography variant="h3" fontWeight={700} color="text.primary">
                About This Workspace
            </Typography>

            <Typography variant="body1" color="text.secondary">
                This workspace is designed for creators who want a clean, expressive environment for building,
                editing, and experimenting with music. Every part of the interface is crafted to be intuitive,
                ergonomic, and friendly to both newcomers and power users.
            </Typography>

            <Divider />

            <Typography variant="h5" fontWeight={600} color="text.primary">
                Philosophy
            </Typography>
            <Typography variant="body1" color="text.secondary">
                The goal is simple: reduce friction, increase clarity, and make every tool feel like an
                extension of your thinking. Whether you’re drafting content, editing files, or exploring new
                ideas, the workspace adapts to you — not the other way around.
            </Typography>

            <Divider />

            <Typography variant="h5" fontWeight={600} color="text.primary">
                Features
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
                <li>Responsive, ergonomic layout for small and large screens</li>
                <li>Dynamic tab system with renameable editor tabs</li>
                <li>Modular architecture built for contributors</li>
                <li>Clean, distraction‑free editing environment</li>
                <li>Future‑ready design for tools, plugins, and extensions</li>
            </Box>

            <Divider />

            <Typography variant="h5" fontWeight={600} color="text.primary">
                Vision
            </Typography>
            <Typography variant="body1" color="text.secondary">
                This workspace is part of a larger effort to build expressive, contributor‑friendly tools
                that scale with your creativity. It’s not just a UI — it’s a foundation for future ideas,
                experiments, and collaborations.
            </Typography>

            <Typography variant="body2" color="text.disabled" sx={{ mt: 4 }}>
                Built with care, clarity, and a relentless focus on onboarding.
            </Typography>
        </Box>
    )
}
