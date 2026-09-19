'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useAuthContext } from "@/context/AuthProvider";
import { TextField, Button, Box, Typography, InputAdornment, IconButton, Stack } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@mui/material/styles";
import AuthCard from "./AuthCard";

// 1️⃣ Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter()
    const theme = useTheme()

    // 2️⃣ React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { login } = useAuthContext()

    // 3️⃣ Submit handler
    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await axios.post<{ user_id: string }>(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, data);
            const user_id = res.data.user_id
            const userData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user_id}`)

            login(userData.data)
            router.push("/workspace")
        } catch (err) {
            setErrorMsg(`Invalid credentials. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false)
    const handleTogglePassword = () => setShowPassword(!showPassword)

    return (
        <AuthCard title="Welcome Back" subtitle="Log in to keep riffing.">
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2.5}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        type="email"
                        {...register("email")}
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                    />

                    <TextField
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        autoComplete="current-password"
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

                    <Typography
                        component={Link}
                        href="/forgot-password"
                        variant="body2"
                        sx={{
                            color: theme.palette.accent.main,
                            textAlign: 'right',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        Forgot password?
                    </Typography>

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
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </motion.div>

                    {errorMsg && (
                        <Typography variant="body2" sx={{ color: theme.palette.error.main, textAlign: 'center' }}>
                            {errorMsg}
                        </Typography>
                    )}

                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        New to NEXTRiff?{' '}
                        <Link href="/register" style={{ color: theme.palette.accent.main, textDecoration: 'none' }}>
                            Create an account
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </AuthCard>
    );
}