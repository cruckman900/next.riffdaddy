// app/layout.tsx

import EmotionCacheProvider from '@/components/EmotionCacheProvider'
import ThemeRegistry from '@/components/ThemeRegistry'
import ToastMount from '@/components/ToastMount'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashMount from '@/components/SplashMount'
import { ThemeProvider } from '@/context/ThemeContext'
import DocumentWrapper from '@/components/DocumentWrapper'
import './styles/globals.css'
import { AuthProvider } from '@/context/AuthProvider'
import { TabsProvider } from '@/context/TabsContext'

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
                                    <TabsProvider>
                                        <Navbar />
                                        <main className="flex-1 overflow-y-auto flex min-h-0">
                                            {children}
                                        </main>
                                    </TabsProvider>
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
