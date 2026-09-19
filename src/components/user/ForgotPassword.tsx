'use client';
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import AuthCard from "./AuthCard";

// 1️⃣ Zod schema
const loginSchema = z.object({
    email: z.string().email("Invalid email"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function ForgotPasswordForm() {
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
    const [sent, setSent] = useState(false);

    // 3️⃣ Submit handler
    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        setErrorMsg("");
        try {
            const res = await axios.post<{ user_id: string }>(`${process.env.NEXT_PUBLIC_API_URL}/users/forget-password`, data);
            localStorage.setItem("user_id", res.data.user_id);
            setSent(true);
        } catch (err) {
            setErrorMsg(`Something went wrong. Please try again. ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="Forgot Password?" subtitle="We'll send a reset link to your email.">
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
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                    </motion.div>

                    {sent && (
                        <Typography variant="body2" sx={{ color: theme.palette.accent.main, textAlign: 'center' }}>
                            Reset link sent — check your inbox.
                        </Typography>
                    )}

                    {errorMsg && (
                        <Typography variant="body2" sx={{ color: theme.palette.error.main, textAlign: 'center' }}>
                            {errorMsg}
                        </Typography>
                    )}

                    <Typography variant="body2" textAlign="center" color="text.secondary">
                        Remembered your password?{' '}
                        <Link href="/login" style={{ color: theme.palette.accent.main, textDecoration: 'none' }}>
                            Log in
                        </Link>
                    </Typography>
                </Stack>
            </Box>
        </AuthCard>
    );
}