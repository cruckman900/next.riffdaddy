'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthContext } from "@/context/AuthProvider";
import { TextField, Button, Box, Typography, InputAdornment, Divider, IconButton } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";

// 1️⃣ Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter()

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

    const handleClick = () => {
        router.push("/forgot-password")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full mx-auto bg-black shadow-md rounded-md p-6"
        >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Typography variant="h5" className="mb-4 text-center font-bold">
                    Welcome Back
                </Typography>

                <Divider textAlign="left" sx={{ p: 1.5 }}>
                    <Typography variant="caption" fontSize={16} color="textSecondary">
                        Login Credentials
                    </Typography>
                </Divider>

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

                <Typography
                    variant='button'
                    sx={{
                        mx: '50%',
                        translate: '-50%',
                        color: 'red',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'inline-block',
                        textAlign: 'center',
                        width: '100%'
                    }}
                    onClick={handleClick}
                >
                    Forgot Password
                </Typography>

                <motion.div whileHover={{ scale: 1.02 }} className="mt-4">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </motion.div>

                {errorMsg && (
                    <Typography className="text-red-600 text-center mt-2">
                        {errorMsg}
                    </Typography>
                )}
            </Box>
        </motion.div>
    );
}