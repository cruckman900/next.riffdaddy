// app/layout.tsx 
import EmotionCacheProvider from '@/components/EmotionCacheProvider'
import ThemeRegistry from '@/components/ThemeRegistry'
import ToastMount from '@/components/ToastMount'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashIntro from '@/components/SplashIntro'
import { ThemeProvider } from '@/context/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import './styles/globals.css'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-gray-950 text-white">
                <ThemeProvider>
                    <ThemeSwitcher />
                    <EmotionCacheProvider>
                        <SplashIntro />
                        <ThemeRegistry>
                            <Header />
                            <Navbar />
                            <div className="w-full bg-gray-900 text-green-400 text-sm px-4 py-2 font-mono whitespace-nowrap overflow-hidden">
                                <span className="inline-block animate-marquee">🎶 Now Playing: “Linear Descent” · Tab Preview: E5 · G5 · A5 · D5 · F#5 · B5 · C#5 · Riff On!</span>
                            </div>
                            <main className="flex-grow container mx-auto px-4 py-6">
                                {children}
                            </main>
                            <Footer />
                            <ToastMount />
                        </ThemeRegistry>
                    </EmotionCacheProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
