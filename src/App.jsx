import React,{ useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import {login,logout} from "./store/authSlice"
import { Outlet, useLocation } from 'react-router-dom'
import { Header,Footer } from './components'
import { Toaster } from 'react-hot-toast'


function App() {
  
  const [loading,setLoading]=useState(true)
  const dispatch=useDispatch()
  const { pathname } = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[])

  return !loading ? (
    <div className='min-h-screen w-full bg-surface flex flex-col'>
      <Header/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
      <Toaster position="bottom-right" />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-text-muted">Loading StoryNest...</p>
      </div>
    </div>
  )
}

export default App
