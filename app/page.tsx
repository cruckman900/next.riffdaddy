// app/page.tsx or app/layout.tsx
import TabPreview from '@/components/TabPreview'
import { mockTabs } from '@/lib/mockTabs'

export const metadata = {
  title: 'fanTABulous — Riff-Ready Tab Parsing',
  description: 'A platform for expressive musicians to preview, parse, and riff on guitar tabs.',
  openGraph: {
    title: 'fanTABulous — Riff-Ready Tab Parsing',
    description: 'Preview tabs with glowing transitions, genre-based themes, and musical metadata.',
    url: 'https://next.riffdaddy.netlify.app',
    siteName: 'fanTABulous',
    images: [
      {
        url: 'https://next.riffdaddy.netlify.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'fanTABulous Tab Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'fanTABulous — Riff-Ready Tab Parsing',
    description: 'Preview tabs with glowing transitions, genre-based themes, and musical metadata.',
    creator: '@riffdaddy',
    images: ['https://next.riffdaddy.netlify.app/twitter-image.png'],
  },
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      {mockTabs.map((tab, index) => (
        <TabPreview key={index} {...tab} />
      ))}
    </div>
  )
}
