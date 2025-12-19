"use client"

import { Box, Button, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-black text-white px-1 py-3 flex items-center justify-between shadow-md print:hidden">
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                <Link href="/">
                    <Button sx={{ margin: 0, padding: 0 }}>
                        <Image
                            src="/NEXTRiff_Badge.png"
                            alt="NEXTRiff Logo"
                            width={40}
                            height={40}
                            className="drop-shadow-[0_0_4px_#00ff80]"
                            style={{ borderRadius: '8px' }}
                        />
                    </Button>
                </Link>

                <Typography sx={{ fontSize: '1.75rem' }}>
                    <span className="nextriff-title print:hidden">NEXTRiff</span>
                </Typography>
            </Box>

            <Link href="https://lineardescent.com/" target="_blank">
                <Button sx={{ margin: 0, padding: 1 }}>
                    <Typography sx={{ flexGrow: 1, fontVariant: 'small-caps', fontSize: '1.15rem', color: '#ffffff' }}>
                        <span className="powered-by print:hidden" style={{ color: 'ffffff' }}>
                            Powered By <span className="linear-descent">LinearDescent</span>
                        </span>
                    </Typography>
                </Button>
            </Link>
        </header>
    )
}
