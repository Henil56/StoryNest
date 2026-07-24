import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import authService from "../appwrite/auth"
import appwriteService from "../appwrite/config"
import { useForm } from "react-hook-form"
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { apiSlice } from '../store/apiSlice'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [loading, setLoading] = useState(false)

    const create = async (data) => {
        setLoading(true)
        try {
            // 1. Create account and session
            const sessionData = await authService.createAccount({
                email: data.email,
                password: data.password,
                name: data.username
            })
            
            if (sessionData) {
                const currentUser = await authService.getCurrentUser()
                if (currentUser) {
                    // 2. Upload Profile Picture if provided
                    let profilePicId = null
                    if (data.profilePic && data.profilePic[0]) {
                        const file = await appwriteService.uploadFile(data.profilePic[0])
                        if (file) {
                            profilePicId = file.$id
                        }
                    }

                    // 3. Create Public Profile Document
                    await appwriteService.createUserProfile({
                        userId: currentUser.$id,
                        username: data.username,
                        profilePic: profilePicId
                    })

                    // 4. Update Redux store and redirect
                    dispatch(apiSlice.util.invalidateTags(['UserProfile']));
                    dispatch(login({ userData: currentUser }));
                    toast.success('Account created successfully!')
                    navigate("/")
                } else {
                    navigate("/login")
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center w-full px-4">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-surface-elevated animate-fade-in">
                {/* Left decorative panel */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#87CEEB] via-[#4682B4] to-[#17304D] text-white">
                    <div className="text-5xl mb-6">✨</div>
                    <h2 className="text-3xl font-bold leading-tight">Join the<br/>StoryNest community</h2>
                    <p className="mt-4 text-[#B0E0E6] text-lg leading-relaxed">Start sharing your stories with thousands of readers around the world.</p>
                    <div className="mt-8 flex gap-3">
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                        <div className="w-12 h-1 rounded-full bg-white/40"></div>
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="p-8 sm:p-12">
                    <div className="mb-6 flex justify-center lg:justify-start">
                        <Logo size="small" alt="StoryNest logo" />
                    </div>

                    <h2 className="text-2xl font-bold text-text-primary">Create your account</h2>
                    <p className="mt-2 text-sm text-text-muted">
                        Already have one?&nbsp;
                        <Link
                            to="/login"
                            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                        >
                            Sign In
                        </Link>
                    </p>

                    <button
                        onClick={() => authService.loginWithGoogle()}
                        className="w-full mt-6 flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl bg-surface hover:bg-surface-elevated hover:shadow-sm transition-all duration-200 text-text-primary font-medium"
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
                            <span className="px-2 bg-surface-elevated text-text-muted">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(create)} className="mt-6" noValidate>
                        <div className='space-y-5'>
                            <Input
                                label="Username"
                                placeholder="Choose a username"
                                required
                                error={errors.username?.message}
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message: "Username must be at least 3 characters"
                                    }
                                })}
                            />
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
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
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
                            
                            <div>
                                <label className="inline-flex items-center gap-1 mb-1.5 pl-0.5 text-sm font-medium text-text-secondary">
                                    Profile Picture (Optional)
                                </label>
                                <div className="mt-1 rounded-xl border-2 border-dashed border-border hover:border-primary-300 transition-colors duration-200 p-4 text-center">
                                    <input
                                        type="file"
                                        className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/40 dark:file:text-primary-300 cursor-pointer w-full"
                                        accept="image/png, image/jpg, image/jpeg, image/gif"
                                        {...register("profilePic")}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                                loadingText="Creating account..."
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
