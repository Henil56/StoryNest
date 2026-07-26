import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import authService from "../appwrite/auth"
import appwriteService from "../appwrite/config"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getAvatarUrl } from '../utils/avatar'
import { apiSlice } from '../store/apiSlice'
import { rateLimiter } from '../utils/rateLimiter'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const currentUser = useSelector((state) => state.auth.userData)

    const isGoogleNew = location.state?.isGoogleNew || searchParams.get('googleNew') === 'true'

    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm({
        defaultValues: {
            username: location.state?.name || currentUser?.name || '',
            email: location.state?.email || currentUser?.email || ''
        }
    })
    const [loading, setLoading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setPreviewUrl(null)
        }
    }

    const handleRemoveFile = () => {
        setPreviewUrl(null)
        setValue("profilePic", null)
    }

    useEffect(() => {
        if (isGoogleNew && (currentUser?.name || location.state?.name)) {
            setValue('username', location.state?.name || currentUser?.name || '')
        }
        if (isGoogleNew && (currentUser?.email || location.state?.email)) {
            setValue('email', location.state?.email || currentUser?.email || '')
        }
    }, [isGoogleNew, currentUser, location.state, setValue])

    const create = async (data) => {
        // Rate limit check for Auth signup route
        const rateCheck = rateLimiter.checkAuthLimit('signup', data.email)
        if (!rateCheck.allowed) {
            toast.error(rateCheck.errorMessage, { duration: 5000 })
            return
        }

        setLoading(true)
        try {
            // Check username uniqueness
            const isTaken = await appwriteService.isUsernameTaken(data.username, isGoogleNew ? currentUser?.$id : null)
            if (isTaken) {
                setError("username", {
                    type: "manual",
                    message: "This username is already taken. Please choose a different username."
                })
                toast.error("This username is already taken. Please choose a different username.")
                setLoading(false)
                return
            }

            if (isGoogleNew && currentUser) {
                // Google OAuth user completing profile
                let profilePicId = location.state?.googleAvatar || null
                if (data.profilePic && data.profilePic[0]) {
                    const file = await appwriteService.uploadFile(data.profilePic[0])
                    if (file) {
                        profilePicId = file.$id
                    }
                }

                await appwriteService.createUserProfile({
                    userId: currentUser.$id,
                    username: data.username,
                    profilePic: profilePicId,
                    email: currentUser.email || data.email
                })

                dispatch(apiSlice.util.invalidateTags(['UserProfile']))
                dispatch(login({ userData: currentUser }))
                toast.success('Profile created successfully!')
                navigate('/')
                return
            }

            // Normal Email/Password Signup
            const sessionData = await authService.createAccount({
                email: data.email,
                password: data.password,
                name: data.username
            })
            
            if (sessionData) {
                const user = await authService.getCurrentUser()
                if (user) {
                    let profilePicId = null
                    if (data.profilePic && data.profilePic[0]) {
                        const file = await appwriteService.uploadFile(data.profilePic[0])
                        if (file) {
                            profilePicId = file.$id
                        }
                    }

                    await appwriteService.createUserProfile({
                        userId: user.$id,
                        username: data.username,
                        profilePic: profilePicId,
                        email: user.email || data.email
                    })

                    dispatch(apiSlice.util.invalidateTags(['UserProfile']))
                    dispatch(login({ userData: user }))
                    toast.success('Account created successfully!')
                    navigate('/')
                } else {
                    navigate('/login')
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center w-full px-4 page-enter">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-surface-elevated animate-fade-in">
                {/* Left decorative panel */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#87CEEB] via-[#4682B4] to-[#17304D] text-white relative overflow-hidden">
                    {/* Floating decorations */}
                    <div className="absolute top-12 right-16 w-24 h-24 rounded-full bg-white/10 blur-xl animate-float"></div>
                    <div className="absolute bottom-16 left-12 w-32 h-32 rounded-full bg-white/5 blur-lg" style={{ animation: 'float 6s ease-in-out infinite 1s' }}></div>
                    <div className="absolute top-1/3 right-8 w-14 h-14 rounded-full bg-white/8 blur-md" style={{ animation: 'float 4s ease-in-out infinite 2s' }}></div>
                    
                    <div className="relative z-10">
                        <div className="text-5xl mb-6">✨</div>
                        <h2 className="text-3xl font-bold leading-tight">{isGoogleNew ? 'Welcome to StoryNest!' : 'Join the StoryNest community'}</h2>
                        <p className="mt-4 text-[#B0E0E6] text-lg leading-relaxed">{isGoogleNew ? 'Set up your profile to start sharing and discovering amazing stories.' : 'Start sharing your stories with thousands of readers around the world.'}</p>
                        <div className="mt-8 flex gap-3">
                            <div className="w-12 h-1 rounded-full bg-white/20"></div>
                            <div className="w-12 h-1 rounded-full bg-white/40"></div>
                            <div className="w-12 h-1 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right form panel */}
                <div className="p-8 sm:p-12">
                    <div className="mb-6 flex justify-center lg:justify-start">
                        <Logo size="small" alt="StoryNest logo" />
                    </div>

                    <h2 className="text-2xl font-bold text-text-primary">{isGoogleNew ? 'Complete your profile' : 'Create your account'}</h2>
                    <p className="mt-2 text-sm text-text-muted">
                        {isGoogleNew ? 'Choose your username & optional profile picture' : (
                            <>
                                Already have one?&nbsp;
                                <Link
                                    to="/login"
                                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </p>

                    {!isGoogleNew && (
                        <>
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
                        </>
                    )}

                    <form onSubmit={handleSubmit(create)} className="mt-6" noValidate>
                        <div className='space-y-5'>
                            {/* Profile Pic Icon + Username Row */}
                            <div className="flex items-start gap-4">
                                {/* Clean Avatar Circle */}
                                <div className="relative flex-shrink-0 group cursor-pointer pt-6">
                                    <label className="cursor-pointer block relative" title="Upload profile picture">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpg, image/jpeg, image/gif"
                                            {...register("profilePic", {
                                                onChange: handleFileChange
                                            })}
                                        />
                                        {previewUrl ? (
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md ring-2 ring-primary-500/50 border border-white/20">
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Profile Preview" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-semibold transition-opacity duration-200">
                                                    Edit
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-surface-elevated hover:bg-surface border-2 border-dashed border-border hover:border-primary-400 text-text-muted hover:text-primary-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300 relative">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-600 text-white border-2 border-surface flex items-center justify-center text-[10px] font-bold shadow">
                                                    +
                                                </div>
                                            </div>
                                        )}
                                    </label>
                                    {previewUrl && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="absolute top-5 -right-1 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] shadow-md transition-transform hover:scale-110 z-20"
                                            title="Remove picture"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Username Input */}
                                <div className="flex-1 min-w-0">
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
                                </div>
                            </div>

                            {!isGoogleNew && (
                                <>
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
                                </>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                                loadingText={isGoogleNew ? "Completing setup..." : "Creating account..."}
                            >
                                {isGoogleNew ? "Complete Setup & Continue ✨" : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
