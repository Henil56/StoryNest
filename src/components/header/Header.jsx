import React, { useState, useEffect } from 'react'
import {Container,Logo,LogoutBtn,ThemeToggle} from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetUserProfileQuery } from '../../store/apiSlice'
import appwriteService from '../../appwrite/config'
import { getAvatarUrl } from '../../utils/avatar'

function Header() {
  const authStatus=useSelector((state)=>state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate=useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: userProfile } = useGetUserProfileQuery(userData?.$id, { skip: !userData?.$id })
  
  const navItems=[
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "All Posts",
      slug: "/all-post",
      active: true,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
    {
      name: "Profile",
      slug: `/author/${userData?.$id}`,
      active: authStatus,
      isProfile: true,
      profilePic: userProfile?.profilePic,
      username: userProfile?.username || userData?.name
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
  ]

  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'border-b border-white/15 dark:border-white/10 bg-[#17304D]/85 dark:bg-[#0a0314]/75 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_0_rgba(15,23,42,0.25)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]' 
          : 'border-b border-transparent bg-[#17304D] dark:bg-[#0a0314]'
      }`}
    >
      <Container>
        <nav className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-18 md:h-20' : 'h-20 md:h-22'}`}>
          <div className='flex items-center'>
            <Link to='/' aria-label="StoryNest Home" className="flex items-center pt-2.5 pb-0.5 mt-1 transition-transform duration-300 hover:scale-[1.02] active:scale-95">
              <Logo width="170px" variant='dark' className="h-auto object-contain" />
            </Link>
          </div>
          
          <div className='flex items-center'>
            <ul className='hidden md:flex ml-auto items-center gap-1.5 list-none'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 text-sm font-bold rounded-full transition-all duration-300 active:scale-95 ${
                        pathname === item.slug
                          ? 'bg-[#B0E0E6] border border-white/40 text-[#17304D] shadow-md shadow-[#B0E0E6]/30 dark:bg-[#3D0E2D] dark:border-[#9D174D] dark:text-[#FBCFE8] dark:shadow-[#9D174D]/25 scale-[1.02]'
                          : 'text-white/80 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/10 hover:-translate-y-0.5 shadow-none'
                      }`}
                    >
                      {item.isProfile ? (
                        <img 
                          src={getAvatarUrl(userProfile?.profilePic, userProfile?.email || userData?.email, userProfile?.username || userData?.name)} 
                          alt="Profile" 
                          referrerPolicy="no-referrer"
                          className="w-6 h-6 rounded-full object-cover border border-white/30 transition-all duration-300"
                        />
                      ) : null}
                      {item.isProfile ? item.username?.split(' ')[0] || 'Profile' : item.name}
                    </button>
                  </li>
                ) : null
              )}
              <li className="ml-2">
                <ThemeToggle />
              </li>
              {authStatus && (
                <li className="ml-2">
                  <LogoutBtn />
                </li>
              )}
            </ul>
            
            <div className="flex md:hidden items-center gap-2">
               <ThemeToggle />
               <button
                 className="p-2 -mr-2 text-white/80 hover:text-white hover:bg-white/10 dark:text-text-secondary dark:hover:text-text-primary dark:hover:bg-surface-dark/50 rounded-xl transition-all duration-300"
                 onClick={() => setMobileOpen(!mobileOpen)}
                 aria-label="Toggle menu"
                 aria-expanded={mobileOpen}
               >
                 <svg className={`w-5 h-5 transition-transform duration-300 ${mobileOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   {mobileOpen ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                   )}
                 </svg>
               </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile Menu with slide-down animation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-[500px] opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-2 border-t border-white/10">
            <ul className='flex flex-col gap-1.5 list-none'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => { navigate(item.slug); setMobileOpen(false); }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-2xl text-base font-bold transition-all duration-300 active:scale-98 ${
                        pathname === item.slug
                          ? 'bg-[#B0E0E6] border border-white/40 text-[#17304D] shadow-sm dark:bg-[#3D0E2D] dark:border-[#9D174D] dark:text-[#FBCFE8]'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {item.isProfile ? (
                        <img 
                          src={getAvatarUrl(userProfile?.profilePic, userProfile?.email || userData?.email, userProfile?.username || userData?.name)} 
                          alt="Profile" 
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-white/30"
                        />
                      ) : null}
                      {item.isProfile ? item.username || 'Profile' : item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li className="mt-2 border-t border-white/10 pt-3 px-1">
                  <LogoutBtn />
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>
      {isScrolled && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#87CEEB]/40 dark:via-primary-500/50 to-transparent pointer-events-none transition-opacity duration-500"
          aria-hidden="true"
        />
      )}
    </header>
  )
}

export default Header