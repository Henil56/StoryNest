import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"
import { useDispatch } from 'react-redux'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")

    const login = async (data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(authLogin({ userData }));
                }
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='min-h-[80vh] flex items-center justify-center w-full px-4'>
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-surface-elevated animate-fade-in">
                {/* Left decorative panel */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 text-white">
                    <div className="text-5xl mb-6">📖</div>
                    <h2 className="text-3xl font-bold leading-tight">Welcome back to<br/>StoryNest</h2>
                    <p className="mt-4 text-primary-200 text-lg leading-relaxed">Continue your writing journey. Your stories are waiting for you.</p>
                    <div className="mt-8 flex gap-3">
                        <div className="w-12 h-1 rounded-full bg-white/40"></div>
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
                        <div className="w-12 h-1 rounded-full bg-white/20"></div>
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

                    {error && (
                        <div className="mt-6 flex items-center gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 text-sm text-danger">
                            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(login)} className="mt-8">
                        <div className='space-y-5'>
                            <Input
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                                    }
                                })}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", { required: true })}
                            />

                            <Button type="submit" className="w-full" size="lg">Sign In</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
