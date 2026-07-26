import React,{ useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import appwriteService from './appwrite/config'
import {login,logout} from "./store/authSlice"
import { Outlet, useLocation } from 'react-router-dom'
import { Header,Footer,Logo } from './components'
import { Toaster } from 'react-hot-toast'
import { apiSlice } from './store/apiSlice'


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
        if (userData.$id && userData.email) {
          appwriteService.updateUserProfile(userData.$id, {
            email: userData.email,
            username: userData.name
          }).then(() => {
            dispatch(apiSlice.util.invalidateTags(['UserProfile']));
          }).catch(() => {});
        }
      }else{
        dispatch(logout())
      }
    })
    .finally(()=>setLoading(false))
  },[dispatch])

  return !loading ? (
    <div className='min-h-screen w-full bg-surface flex flex-col'>
      <Header/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: '!bg-surface-elevated !text-text-primary !border !border-border/50 !shadow-xl !rounded-xl !text-sm !font-medium',
          duration: 3000,
          style: {
            padding: '12px 16px',
          },
        }}
      />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        <Logo size="small" />
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm font-medium text-text-muted">Loading StoryNest...</p>
      </div>
    </div>
  )
}

export default App
