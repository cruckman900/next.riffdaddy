'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthProvider"

export default function TabsPage() {
    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [router, user])

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to Tabs</h1>
            <p className="text-gray-600">Your contributor-mode dashboard awaits.</p>
        </div>
    )
}