'use client'

import dynamic from 'next/dynamic'

const SplashIntro = dynamic(() => import('@/components/SplashIntro'), {
    ssr: false,
    loading: () => null 
})

export default function SplashMount() {
    return <SplashIntro />
}
