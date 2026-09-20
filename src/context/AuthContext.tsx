'use client'

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { UserRead } from "@/types/user"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const STORAGE_KEY = 'nextriff.auth.v1'

// 🧪 DEV BYPASS: lets you reach the workspace instantly without registering/
// logging in for real — handy for local testing. It still counts as a real
// "logged in" session everywhere that matters (splash gating, workspace
// access): the only difference is there's no backend-issued token behind it,
// so it's never sent to the API and never re-verified via /users/me.
const DEV_AUTH_BYPASS = true
const DEV_USER: UserRead = {
    id: "dev-user",
    username: "Riff Tester",
    email: "dev@nextriff.test",
    created_at: new Date().toISOString(),
}

interface StoredAuth {
    token: string | null
    user: UserRead
}

function readStoredAuth(): StoredAuth | null {
    if (typeof window === "undefined") return null
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as StoredAuth) : null
    } catch {
        return null
    }
}

function applyAuthHeader(token: string | null) {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

const useAuth = () => {
    const router = useRouter()
    const [user, setUser] = useState<UserRead | null>(null)
    // Tracks whether we've finished checking localStorage (and, for a real
    // token, re-verifying it against the backend) yet, so consumers don't
    // redirect-away or flash the splash before the real auth state is known.
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const restore = async () => {
            const stored = readStoredAuth()

            if (!stored) {
                if (DEV_AUTH_BYPASS) {
                    applyAuthHeader(null)
                    setUser(DEV_USER)
                }
                setLoading(false)
                return
            }

            applyAuthHeader(stored.token)

            // A dev-bypass session (no real token) is trusted as-is — there's
            // nothing on the backend to verify it against.
            if (!stored.token) {
                setUser(stored.user)
                setLoading(false)
                return
            }

            // Re-verify the token against the backend rather than blindly
            // trusting whatever's in localStorage — it may have expired or
            // the account may no longer exist. This also refreshes the
            // cached user fields (e.g. username changes elsewhere).
            try {
                const res = await axios.get<UserRead>(`${API_BASE}/users/me`)
                if (!cancelled) setUser(res.data)
            } catch {
                if (!cancelled) {
                    localStorage.removeItem(STORAGE_KEY)
                    applyAuthHeader(null)
                    setUser(DEV_AUTH_BYPASS ? DEV_USER : null)
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        restore()
        return () => { cancelled = true }
    }, [])

    // `token` is null for the dev-bypass "login" (see DEV_AUTH_BYPASS above);
    // real login/register always pass the backend-issued access token.
    const login = useCallback((userData: UserRead, token: string | null = null) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: userData }))
        applyAuthHeader(token)
        setUser(userData)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY)
        applyAuthHeader(null)
        setUser(null)
        router.push('/')
    }, [router])

    return { user, loading, login, logout }
}

export default useAuth
