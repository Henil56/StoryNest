import React, { useState, useEffect } from 'react'
import {Container,Logo,LogoutBtn,ThemeToggle} from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetUserProfileQuery } from '../../store/apiSlice'
import appwriteService from '../../appwrite/config'

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

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'border-b border-white/10 bg-[#17304D]/95 dark:border-border/50 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-sm' 
          : 'border-b border-transparent bg-[#17304D] dark:bg-[#0F172A]'
      }`}
    >
      <Container>
        <nav className='flex items-center justify-between h-24'>
          <div className='flex items-center max-h-20'>
            <Link to='/' aria-label="StoryNest Home">
              <Logo size='xs' variant='dark' />
            </Link>
          </div>
          
          <div className='flex items-center'>
            <ul className='hidden md:flex ml-auto items-center gap-1 list-none'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        pathname === item.slug
                          ? 'bg-primary-500 text-white dark:bg-primary-900/30 dark:text-primary-300 shadow-sm shadow-primary-500/20'
                          : 'text-white/80 hover:bg-white/10 hover:text-white dark:text-text-secondary dark:hover:bg-surface-dark/50 dark:hover:text-text-primary'
                      }`}
                    >
                      {item.isProfile && item.profilePic ? (
                        <img 
                          src={appwriteService.getFilePreview(item.profilePic)} 
                          alt="Profile" 
                          className="w-6 h-6 rounded-full object-cover border border-white/20"
                        />
                      ) : item.isProfile ? (
                        <div className="w-6 h-6 rounded-full bg-primary-600/50 flex items-center justify-center text-white text-xs border border-white/20">
                          {item.username?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
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
                 className="p-2 -mr-2 text-white/80 hover:text-white hover:bg-white/10 dark:text-text-secondary dark:hover:text-text-primary dark:hover:bg-surface-dark/50 rounded-lg transition-colors"
                 onClick={() => setMobileOpen(!mobileOpen)}
                 aria-label="Toggle menu"
                 aria-expanded={mobileOpen}
               >
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <ul className='flex flex-col gap-2 list-none'>
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => { navigate(item.slug); setMobileOpen(false); }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        pathname === item.slug
                          ? 'bg-primary-500 text-white dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-white/80 hover:bg-white/10 hover:text-white dark:text-text-secondary dark:hover:bg-surface-dark/50 dark:hover:text-text-primary'
                      }`}
                    >
                      {item.isProfile && item.profilePic ? (
                        <img 
                          src={appwriteService.getFilePreview(item.profilePic)} 
                          alt="Profile" 
                          className="w-7 h-7 rounded-full object-cover border border-white/20"
                        />
                      ) : item.isProfile ? (
                        <div className="w-7 h-7 rounded-full bg-primary-600/50 flex items-center justify-center text-white text-xs border border-white/20">
                          {item.username?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                      ) : null}
                      {item.isProfile ? item.username || 'Profile' : item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li className="mt-2 border-t border-border pt-4 px-2">
                  <LogoutBtn />
                </li>
              )}
            </ul>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header