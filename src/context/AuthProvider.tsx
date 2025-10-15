'use client'

import { createContext, useContext, ReactNode } from "react";
import useAuth from "./AuthContext";
import { UserRead } from "@/types/user";

export interface AuthContextType {
    user: UserRead | null
    login: (userData: UserRead) => void
    logout: () => void
}

interface AuthProviderProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider")
    }
    return context
}