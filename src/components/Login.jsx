import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import authService from "../appwrite/auth"
import appwriteService from "../appwrite/config"
import { useForm } from "react-hook-form"
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { apiSlice } from '../store/apiSlice'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    const login = async (data) => {
        setLoading(true)
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    try {
                        await appwriteService.updateUserProfile(userData.$id, {
                            email: userData.email || data.email,
                            username: userData.name
                        });
                        dispatch(apiSlice.util.invalidateTags(['UserProfile']));
                    } catch (err) {
                        console.error("Failed to sync profile email:", err);
                    }
                    dispatch(authLogin({ userData }));
                }
                toast.success('Successfully logged in!')
                navigate("/")
            }
        } catch (error) {
            const isInvalidCredentials = error?.code === 401 || error?.message?.toLowerCase().includes('invalid credentials');
            const errorMessage = isInvalidCredentials 
                ? 'Authentication failed. Please verify your email and password, or create a new account.' 
                : error.message || 'Failed to login';
            toast.error(errorMessage, { duration: 4000 })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center w-full px-4 page-enter'>
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-surface-elevated animate-fade-in">
                {/* Left decorative panel */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#87CEEB] via-[#4682B4] to-[#17304D] text-white relative overflow-hidden">
                    {/* Floating decorations */}
                    <div className="absolute top-16 right-12 w-28 h-28 rounded-full bg-white/10 blur-xl animate-float"></div>
                    <div className="absolute bottom-24 left-8 w-20 h-20 rounded-full bg-white/5 blur-lg" style={{ animation: 'float 5s ease-in-out infinite 1.5s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/8 blur-md" style={{ animation: 'float 7s ease-in-out infinite 0.5s' }}></div>
                    
                    <div className="relative z-10">
                        <div className="text-5xl mb-6">📖</div>
                        <h2 className="text-3xl font-bold leading-tight">Welcome back to<br/>StoryNest</h2>
                        <p className="mt-4 text-[#B0E0E6] text-lg leading-relaxed">Continue your writing journey. Your stories are waiting for you.</p>
                        <div className="mt-8 flex gap-3">
                            <div className="w-12 h-1 rounded-full bg-white/40"></div>
                            <div className="w-12 h-1 rounded-full bg-white/20"></div>
                            <div className="w-12 h-1 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="p-8 sm:p-12">
                    <div className="mb-6 flex justify-center lg:justify-start">
                        <Logo size="small" alt="StoryNest logo" />
                    </div>

                    <h2 className="text-2xl font-bold text-text-primary">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Don&apos;t have an account?&nbsp;
                        <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200">
                            Sign Up
                        </Link>
                    </p>

                    <button
                        onClick={() => authService.loginWithGoogle()}
                        className="w-full mt-6 flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-surface hover:bg-surface-elevated hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-text-primary font-medium"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="relative mt-8 mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-surface-elevated text-text-muted text-xs uppercase tracking-wider font-medium">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(login)} className="mt-6" noValidate>
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

                            <div className="space-y-1">
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                    error={errors.password?.message}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                />
                                <div className="pt-1">
                                    <Link 
                                        to="/forgot-password" 
                                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors inline-block"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                                loadingText="Signing in..."
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
