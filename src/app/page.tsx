// app/page.tsx
import { Box } from '@mui/material'
import HeroSection from '@/components/home/HeroSection'
import FeatureGrid from '@/components/home/FeatureGrid'

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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <HeroSection />
      <FeatureGrid />
    </Box>
  )
}
