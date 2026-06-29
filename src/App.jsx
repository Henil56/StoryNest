import React,{ useState,useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from './appwrite/auth'
import {login,logout} from "./store/authSlice"
import { Outlet } from 'react-router-dom'
import { Header,Footer } from './components'




function App() {
  
  const [loading,setLoading]=useState(true)
  const dispatch=useDispatch()

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

  return !loading? (
    <div className='min-h-screen w-full'>
      <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <Header/>
      <main className="flex-1">
        <Outlet/>
      </main>
      <Footer/>
      </div>
    </div>
  ):null
}

export default App
