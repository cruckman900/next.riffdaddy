// app/layout.tsx

import EmotionCacheProvider from '@/components/EmotionCacheProvider'
import ThemeRegistry from '@/components/ThemeRegistry'
import ToastMount from '@/components/ToastMount'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashMount from '@/components/SplashMount'
import { ThemeProvider } from '@/context/ThemeContext'
// import ThemeSwitcher from '@/components/ThemeSwitcher'
import DocumentWrapper from '@/components/DocumentWrapper'
import './styles/globals.css'
import { AuthProvider } from '@/context/AuthProvider'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col dark:bg-purple-500 dark:text-black bg-gray-700 text-white">
                <ThemeProvider>
                    <DocumentWrapper>
                        {/* <ThemeSwitcher /> */}
                        <EmotionCacheProvider>
                            <SplashMount />
                            <ThemeRegistry>
                                <AuthProvider>
                                    <Header />
                                    <Navbar />
                                    <div className="relative w-full h-8 overflow-hidden bg-gray-900 text-green-400 text-sm px-4 py-2 font-mono print:hidden">
                                        <div className="whitespace-nowrap animate-marquee">
                                            🎶 Now Playing: “Linear Descent” · Tab Preview: E5 · G5 · A5 · D5 · F#5 · B5 · C#5 · Riff On!
                                        </div>
                                    </div>
                                    <main className="flex-grow container mx-auto px-4 py-6">
                                        {children}
                                    </main>
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
