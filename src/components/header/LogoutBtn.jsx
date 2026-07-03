import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch=useDispatch()
    const logouthandler=()=>{
        authService.logout().then(()=>{
            dispatch(logout())
        })
    }

  return (
    <button
      className='inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-danger hover:border-rose-200 dark:hover:border-rose-800 transition-all duration-200'
      onClick={logouthandler}
      aria-label="Sign out"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  )
}

export default LogoutBtn