"use client"

import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'

export default function Header() {
    const theme = useTheme()

    return (
        <header className="sticky top-0 z-50 px-1 py-3 flex items-center justify-between shadow-md print:hidden" style={{ backgroundColor: theme.palette.background.paper }}>
            <Link href="/">
                <Button sx={{ margin: 0, padding: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <Image
                            src="/NEXTRiff_Badge.png"
                            alt="NEXTRiff Logo"
                            width={40}
                            height={40}
                            className="drop-shadow-[0_0_4px_#00ff80]"
                            style={{ borderRadius: '8px' }}
                        />

                        <Typography sx={{ fontSize: '1.75rem' }}>
                            <span className="nextriff-title print:hidden">NEXTRiff</span>
                        </Typography>
                    </Box>
                </Button>
            </Link>

            <Link href="https://lineardescent.com/" target="_blank">
                <Button sx={{ margin: 0, padding: 1 }}>
                    <Typography sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: theme.palette.text.primary }}>
                        <span className="powered-by print:hidden" style={{ color: theme.palette.text.primary }}>
                            Powered By <span className="linear-descent">LinearDescent</span>
                        </span>
                    </Typography>
                </Button>
            </Link>
        </header>
    )
}
