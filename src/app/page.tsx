// app/page.tsx
import { Box, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

export const metadata = {
  title: 'NEXTRiff — Riff-Ready Tab Parsing',
  description: 'A platform for expressive musicians to preview, parse, and riff on guitar tabs.',
  openGraph: {
    title: 'NEXTRiff — Riff-Ready Tab Parsing',
    description: 'Preview tabs with glowing transitions, genre-based themes, and musical metadata.',
    url: 'https://nextriff.netlify.app',
    siteName: 'NEXTRiff',
    images: [
      {
        url: 'https://nextriff.netlify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NEXTRiff Tab Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXTRiff — Riff-Ready Tab Parsing',
    description: 'Preview tabs with glowing transitions, genre-based themes, and musical metadata.',
    creator: 'LinearDescent',
    images: ['https://nextriff.netlify.app/og-image.png'],
  },
}

export default function HomePage() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600

  const images = [
    {
      src: '/svg/piano.svg',
      alt: 'Piano',
      width: 400,
      height: 250,
    },
    {
      src: '/svg/guitar.svg',
      alt: 'Guitar',
      width: 400,
      height: 250,
    },
    {
      src: '/svg/drums.svg',
      alt: 'Drums',
      width: 400,
      height: 350,
    },
  ]
  return (
    <React.Fragment>
      <Box
        sx={{
          mx: 'auto',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          bgcolor: 'background.paper',
          // minHeight: !isMobile ? 737 : 500,
          zIndex: 0,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }} // vertical on mobile, horizontal on desktop
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ width: '100%', height: '100%' }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{
                flex: '0 1 auto', // allow natural sizing
                maxWidth: '100%',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                style={{
                  height: 'auto', // preserve aspect ratio
                  width: '100%',  // scale to container
                  objectFit: 'contain', // show full image
                  opacity: 0.3, // semi-transparent images
                }}
              />
            </Box>

          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            position: 'absolute',
            top: !isMobile ? '30%' : 0,
            paddingX: '10%',
            color: 'white',
            opacity: 0.75,
            fontWeight: 'bold',
            fontSize: isMobile ? '75rem' : '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          Welcome to NEXTRiff. Create, preview, parse, and riff on guitar tabs.<br />I&apos;ll be adding other instruments and features soon, but for now,<br />let&apos;s get started with the basics.
        </Typography>

        <Typography
          variant="h5"
          sx={{
            position: 'absolute',
            bottom: '55px',
            right: '10px',
            color: '#00ff00',
            fontWeight: 'bold',
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          Built like a rockstar.
        </Typography>
      </Box>
    </React.Fragment>
  )
}
