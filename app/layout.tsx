// app/layout.tsx 
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-gray-950 text-white">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-6">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
