'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AuthProvider"
import Workbench from "@/components/Workbench"

export default function TabsPage() {
    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push("/login")
        }
    }, [router, user])

    return (
        <Workbench />
    )
}