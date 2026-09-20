'use client'

import dynamic from 'next/dynamic'
import { useAuthContext } from '@/context/AuthProvider'

const SplashIntro = dynamic(() => import('./SplashIntro'), {
    ssr: false,
    loading: () => null
})

// Only unauthenticated visitors see the splash — once a user (real or the
// dev-bypass test user) is logged in, refreshing/navigating around the app
// should never interrupt them with the intro again.
export default function SplashMount() {
    const { user, loading } = useAuthContext()
    if (loading || user) return null
    return <SplashIntro />
}
