'use client'

import { useState, useEffect } from "react"
import { UserRead } from "@/types/user"
import { useRouter } from "next/navigation"

const useAuth = () => {
    const router = useRouter()
    const [user, setUser] = useState<UserRead | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) setUser(JSON.parse(stored));
        }
    }, [])

    const login = (userData: UserRead) => {
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("user")
        setUser(null)
        router.push('/')
    }

    return { user, login, logout }
}

export default useAuth