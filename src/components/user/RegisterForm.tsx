// components/RegisterForm.tsx
'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuthContext } from "@/context/AuthProvider"
import { TextField, Button, Box, Typography, InputAdornment, Divider, IconButton } from "@mui/material"
import { UserRead } from "@/types/user"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline"

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

    // 3️⃣ Submit handler
    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            const res = await axios.post<UserRead>(`${process.env.NEXT_PUBLIC_API_URL}/users/`, data)
            setSuccess(true);
            const user_id = res.data.id
            const userData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${user_id}`)
            console.log("User Data", userData);
            login(userData.data)
            router.push("/workspace")
        } catch (err) {
            console.error("Registration failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full mx-auto bg-white shadow-md rounded-md p-6"
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2 }}>
                <Typography variant="h5" className="mb-4 text-center font-bold">
                    Create an Account
                </Typography>

                <Divider textAlign="left" sx={{ p: 1.5 }}>
                    <Typography variant="caption" fontSize={16} color="textSecondary">
                        Account Details
                    </Typography>
                </Divider>

                <TextField
                    label="Username"
                    variant="outlined"
                    type="username"
                    {...register("username")}
                    autoComplete="username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                />

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
                    autoComplete="password"
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
                                    {showPassword ? <LockOpenIcon className="h-5 w-5 text-gray-500" /> : <LockClosedIcon className="h-5 w-5 text-gray-500" />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <motion.div whileHover={{ scale: 1.02 }} className="mt-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </motion.div>

                {success && (
                    <Typography className="text-green-600 text-center mt-2">
                        Registration successful!
                    </Typography>
                )}
            </Box>
        </motion.div>
    )
}
