// app/layout.tsx

import EmotionCacheProvider from '@/context/EmotionCacheProvider'
import ThemeRegistry from '@/components/themes/ThemeRegistry'
import ToastMount from '@/components/helpers/ToastMount'
import Header from '@/components/layout/Header'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SplashMount from '@/components/splash/SplashMount'
import { ThemeProvider } from '@/context/ThemeContext'
import DocumentWrapper from '@/components/helpers/DocumentWrapper'
import './styles/globals.css'
import { AuthProvider } from '@/context/AuthProvider'
import { TabsProvider } from '@/context/TabsContext'
import { MusicProvider } from '@/context/MusicContext'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col dark:bg-purple-500 dark:text-black bg-gray-700 text-white">
                <ThemeProvider>
                    <DocumentWrapper>
                        <EmotionCacheProvider>
                            <SplashMount />
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
                        </EmotionCacheProvider>
                    </DocumentWrapper>
                </ThemeProvider>
            </body>
        </html>
    )
}
