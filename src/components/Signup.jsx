import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button,Input,Logo} from './index'
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"
import { useDispatch } from 'react-redux'

function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register,handleSubmit} = useForm()
    const [error,setError] = useState("")
    
    const create= async(data)=>{
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if(userData){
                const userData = await authService.getCurrentUser()
                if(userData){
                    dispatch(login({userData}));
                }
                navigate("/")
            }

        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full">
        <div className="mx-auto w-full max-w-md rounded-2xl shadow-xl bg-white p-8">
            <div className="mb-3 flex items-center justify-center text-5xl">✨</div>
            <div className="mb-4 flex justify-center">
                <Logo size="large" alt="StoryNest logo" />
            </div>
            <h2 className="text-center text-3xl font-bold leading-tight">✨ Join StoryNest</h2>
            <p className="mt-2 text-center text-base text-black/70">Create Account</p>
            <p className="mt-4 text-center text-sm text-black/60">
                Already have one?&nbsp;
                <Link
                    to="/login"
                    className="font-medium text-primary transition-colors duration-200 hover:underline hover:text-indigo-600"
                >
                    Login
                </Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
            <div className="rounded-2xl bg-white p-8 shadow-sm mt-8">
              <form onSubmit={handleSubmit(create)}>
                <div className='space-y-5'>
                    <Input
                    label="Full Name: "
                    placeholder="Enter your full name"
                    {...register("name", {
                        required: true,
                    })}
                    />
                    <Input
                    label="Email: "
                    placeholder="Enter your email"
                    type="email"
                    {...register("email", {
                        required: true,
                        validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                        }
                    })}
                    />
                    <Input
                    label="Password: "
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                        required: true,})}
                    />
                    <Button type="submit" className="w-full">
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













