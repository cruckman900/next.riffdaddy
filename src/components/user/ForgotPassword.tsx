'use client';
import { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Divider } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

// 1️⃣ Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function ForgotPasswordForm() {
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
            const res = await axios.post<{ user_id: string }>(`${process.env.NEXT_PUBLIC_API_URL}/users/forget-password`, data);
            localStorage.setItem("user_id", res.data.user_id);
            if (res.statusText == "Reset link sent")
                alert("email sent")
            // router.push("/tabs")
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
                    Forgot Password?
                </Typography>

                <Divider textAlign="left" sx={{ p: 1.5 }}>
                    <Typography variant="caption" fontSize={16} color="textSecondary">
                        Login Email
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