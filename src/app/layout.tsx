// app/layout.tsx
'use client'

import EmotionCacheProvider from '@/context/EmotionCacheProvider'
import ToastMount from '@/components/helpers/ToastMount'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SplashMount from '@/components/splash/SplashMount'
import DocumentWrapper from '@/components/helpers/DocumentWrapper'
import './styles/globals.css'
import { AuthProvider } from '@/context/AuthProvider'
import { TabsProvider } from '@/context/TabsContext'
import { MusicProvider } from '@/context/MusicContext'
import { ThemeProviderContext } from '@/context/ThemeContext'
import ThemeRegistry from '@/components/themes/ThemeRegistry'
import { useTheme } from '@mui/material'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const muiTheme = useTheme()

    return (
        <html lang="en">
            <body
                className="min-h-screen flex flex-col"
                style={{
                    backgroundColor: muiTheme.palette.background.default,
                    color: muiTheme.palette.text.primary,
                }}
            >
                <DocumentWrapper>
                    <EmotionCacheProvider>
                        <SplashMount />
                        <ThemeProviderContext>
                            <ThemeRegistry>
                                <AuthProvider>
                                    <Header />
                                    <MusicProvider>
                                        <TabsProvider>
                                            <Navbar />
                                            <main className="flex-1 overflow-y-auto flex min-h-0">
                                                {children}
                                            </main>
                                        </TabsProvider>
                                    </MusicProvider>
                                    <Footer />
                                    <ToastMount />
                                </AuthProvider>
                            </ThemeRegistry>
                        </ThemeProviderContext>
                    </EmotionCacheProvider>
                </DocumentWrapper>
            </body>
        </html>
    )
}
