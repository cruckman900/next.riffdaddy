'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthProvider"
import Cockpit from "@/components/Cockpit"

export default function TabsPage() {
    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [router, user])

    return (
        <Cockpit />
    )
}