import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children,authentication=true}) {

    const navigate = useNavigate()
    const [loader,setLoader]=useState(true)
    const authStatus = useSelector(state=>state.auth.status)

    useEffect(()=>{
        if(authentication && authStatus !== authentication){
            navigate("/login")
        }else if(!authentication && authStatus!== authentication){
            navigate("/")
        }
        setLoader(false)
    },[authStatus,navigate,authentication])

  return loader ? (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  ) : <>{children}</>
}
