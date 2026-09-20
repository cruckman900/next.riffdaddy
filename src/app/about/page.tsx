// src/app/about/page.tsx
import { Box } from '@mui/material'
import AboutHero from '@/components/about/AboutHero'
import MissionSection from '@/components/about/MissionSection'
import FeatureShowcase from '@/components/about/FeatureShowcase'
import TechStackMarquee from '@/components/about/TechStackMarquee'
import JourneyTimeline from '@/components/about/JourneyTimeline'
import AboutCTA from '@/components/about/AboutCTA'

export const metadata = {
    title: 'About — NEXTRiff',
    description: 'The story, mission, and tech behind NEXTRiff — a riff-ready tab and notation editor for expressive musicians.',
    openGraph: {
        title: 'About — NEXTRiff',
        description: 'The story, mission, and tech behind NEXTRiff — a riff-ready tab and notation editor for expressive musicians.',
        url: 'https://nextriff.netlify.app/about',
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
        title: 'About — NEXTRiff',
        description: 'The story, mission, and tech behind NEXTRiff — a riff-ready tab and notation editor for expressive musicians.',
        creator: 'LinearDescent',
        images: ['https://nextriff.netlify.app/og-image.png'],
    },
}

export default function AboutPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <AboutHero />
            <MissionSection />
            <FeatureShowcase />
            <TechStackMarquee />
            <JourneyTimeline />
            <AboutCTA />
        </Box>
    )
}
