'use client';
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, InputAdornment, Divider } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

// 1️⃣ Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
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

    // 3️⃣ Submit handler
    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await axios.post<{ user_id: string }>("/users/login", data);
            localStorage.setItem("user_id", res.data.user_id);
            // redirect to /tabs or dashboard
        } catch (err) {
            console.error("Login failed", err);
            setErrorMsg("Invalid credentials. Please try again.");
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
                    Welcome Back
                </Typography>

                <Divider textAlign="left" sx={{ p: 1.5 }}>
                    <Typography variant="caption" color="textSecondary">
                        Login Credentials
                    </Typography>
                </Divider>

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
                        ),
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