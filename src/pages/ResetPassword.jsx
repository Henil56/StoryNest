import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth';
import { Button, Input, Logo } from '../components';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../utils/validationSchemas';
import { rateLimiter } from '../utils/rateLimiter';

function ResetPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema)
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // Extract parameters from URL
    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    useEffect(() => {
        // If missing parameters, redirect to login
        if (!userId || !secret) {
            toast.error('Invalid or expired password reset link');
            navigate('/login');
        }
    }, [userId, secret, navigate]);

    const submit = async (data) => {
        const rateCheck = rateLimiter.checkAuthLimit('reset_password', userId);
        if (!rateCheck.allowed) {
            toast.error(rateCheck.errorMessage, { duration: 5000 });
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(userId, secret, data.password, data.password);
            rateLimiter.recordAuthSuccess('reset_password', userId);
            toast.success('Password updated successfully! You can now log in.');
            navigate('/login');
        } catch (error) {
            rateLimiter.recordAuthFailure('reset_password', userId);
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !secret) return null; // Wait for redirect

    return (
        <div className='min-h-[80vh] flex items-center justify-center w-full px-4'>
            <div className={`w-full max-w-md p-8 sm:p-12 rounded-2xl shadow-xl bg-surface-elevated animate-fade-in`}>
                <div className="mb-6 flex justify-center">
                    <Logo size="small" />
                </div>
                
                <h2 className="text-2xl font-bold text-center text-text-primary">
                    Create new password
                </h2>
                <p className="mt-2 text-center text-sm text-text-muted">
                    Your new password must be different from previous used passwords.
                </p>
                
                <form onSubmit={handleSubmit(submit)} className="mt-8" noValidate>
                    <div className='space-y-5'>
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            required
                            error={errors.password?.message}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm new password"
                            required
                            error={errors.passwordAgain?.message}
                            {...register("passwordAgain", {
                                required: "Please confirm your password",
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do not match";
                                    }
                                }
                            })}
                        />
                        <Button
                            type="submit"
                            className="w-full mt-4"
                            size="lg"
                            loading={loading}
                            loadingText="Updating..."
                        >
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
