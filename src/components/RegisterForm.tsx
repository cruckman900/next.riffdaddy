// components/RegisterForm.tsx
'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { TextField, Button, Box, Typography, InputAdornment, Divider } from "@mui/material"
import { UserRead } from "@/types/user"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline"

// 1️⃣ Zod schema
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
    const router = useRouter()

    // 2️⃣ React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // 3️⃣ Submit handler
    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            const res = await axios.post<UserRead>("/users/", data)
            setSuccess(true);
            localStorage.setItem("user_id", res.data.user_id)
            router.push("/tabs")
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
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <UserIcon className="h-5 w-5 text-gray-500" />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                            </InputAdornment>
                        )
                    }}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockClosedIcon className="h-5 w-5 text-gray-500" />
                            </InputAdornment>
                        )
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
