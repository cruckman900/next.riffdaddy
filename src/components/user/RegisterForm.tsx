// components/RegisterForm.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { useAuthContext } from "@/context/AuthProvider"
import { TextField, Button, Box, Typography, InputAdornment, IconButton, Stack } from "@mui/material"
import { AuthResponse } from "@/types/user"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline"
import { useTheme } from "@mui/material/styles"
import AuthCard from "./AuthCard"

// 1️⃣ Zod schema
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
    const { login } = useAuthContext()
    const router = useRouter()
    const theme = useTheme()

    // 2️⃣ React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const [showPassword, setShowPassword] = useState(false)
    const handleTogglePassword = () => setShowPassword(!showPassword)

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // 3️⃣ Submit handler
    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await axios.post<AuthResponse>(`${process.env.NEXT_PUBLIC_API_URL}/users/`, data)
            setSuccess(true);
            login(res.data.user, res.data.access_token)
            router.push("/workspace")
        } catch (err) {
            setErrorMsg(`Registration failed. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="Create an Account" subtitle="Join NEXTRiff and start riffing.">
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        type="text"
                        {...register("username")}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleTogglePassword}
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <LockOpenIcon className="h-5 w-5" style={{ color: theme.palette.text.secondary }} /> : <LockClosedIcon className="h-5 w-5" style={{ color: theme.palette.text.secondary }} />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <motion.div whileHover={{ scale: 1.02 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                bgcolor: theme.palette.accent.main,
                                color: theme.palette.getContrastText(theme.palette.accent.main),
                                boxShadow: `0 0 16px ${theme.palette.accent.main}66`,
                                '&:hover': { bgcolor: theme.palette.accent.main, boxShadow: `0 0 24px ${theme.palette.accent.main}` },
                            }}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </motion.div>

                    {success && (
                        <Typography variant="body2" sx={{ color: theme.palette.accent.main, textAlign: 'center' }}>
                            Registration successful!
                        </Typography>
                    )}

                    {errorMsg && (
                        <Typography variant="body2" sx={{ color: theme.palette.error.main, textAlign: 'center' }}>
                            {errorMsg}
                        </Typography>
                    )}

                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: theme.palette.accent.main, textDecoration: 'none' }}>
                            Log in
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </AuthCard>
    )
}
