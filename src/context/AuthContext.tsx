'use client'

import { useState, useEffect } from "react"
import { UserRead } from "@/types/user"
import { useRouter } from "next/navigation"

// 🚧 DEV BYPASS: auto-logs in a mock user so the workspace is reachable
// without wiring up a real backend yet. Remove once real auth lands.
const DEV_AUTH_BYPASS = true
const DEV_USER: UserRead = {
    id: "dev-user",
    username: "Riff Tester",
    created_at: new Date().toISOString(),
}

const useAuth = () => {
    const router = useRouter()
    const [user, setUser] = useState<UserRead | null>(null)
    // Tracks whether we've finished checking localStorage for a session yet,
    // so consumers don't redirect-away before the real auth state is known.
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) {
                setUser(JSON.parse(stored));
            } else if (DEV_AUTH_BYPASS) {
                setUser(DEV_USER);
            }
        }
        setLoading(false)
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

    return { user, loading, login, logout }
}

export default useAuth