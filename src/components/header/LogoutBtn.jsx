import React from 'react'
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logouthandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate('/login')
        })
    }

  return (
    <button
      className='group inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold text-white/80 border border-white/20 rounded-full hover:bg-rose-500/20 hover:text-rose-200 hover:border-rose-400/50 hover:shadow-md hover:shadow-rose-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-95'
      onClick={logouthandler}
      aria-label="Sign out"
    >
      <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  )
}

export default LogoutBtn