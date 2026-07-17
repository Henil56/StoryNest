import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../appwrite/auth';
import { Button, Input, Logo } from '../components';
import toast from 'react-hot-toast';

function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const submit = async (data) => {
        setLoading(true);
        try {
            await authService.sendPasswordRecovery(data.email);
            setIsSubmitted(true);
            toast.success('Recovery email sent! Please check your inbox.');
        } catch (error) {
            toast.error(error.message || 'Failed to send recovery email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center w-full px-4'>
            <div className={`w-full max-w-md p-8 sm:p-12 rounded-2xl shadow-xl bg-surface-elevated animate-fade-in`}>
                <div className="mb-6 flex justify-center">
                    <Logo size="small" />
                </div>
                
                <h2 className="text-2xl font-bold text-center text-text-primary">
                    Reset your password
                </h2>

                {isSubmitted ? (
                    <div className="mt-8 text-center animate-fade-in">
                        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Check your email</h3>
                        <p className="text-text-muted mb-6">
                            We've sent a password recovery link to your email address. It may take a few minutes to arrive.
                        </p>
                        <Button 
                            className="w-full"
                            onClick={() => window.location.href = '/login'}
                        >
                            Return to Login
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="mt-2 text-center text-sm text-text-muted">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        
                        <form onSubmit={handleSubmit(submit)} className="mt-8" noValidate>
                            <div className='space-y-5'>
                                <Input
                                    label="Email"
                                    placeholder="Enter your email"
                                    type="email"
                                    required
                                    error={errors.email?.message}
                                    {...register("email", {
                                        required: "Email is required",
                                        validate: {
                                            matchPattern: (value) => 
                                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Please enter a valid email address",
                                        }
                                    })}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    loading={loading}
                                    loadingText="Sending link..."
                                >
                                    Send Recovery Link
                                </Button>
                            </div>
                        </form>
                        <p className="mt-6 text-center text-sm text-text-muted">
                            Remember your password?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
