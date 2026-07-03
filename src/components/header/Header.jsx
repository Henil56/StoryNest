import React, { useState, useEffect } from 'react'
import {Container,Logo,LogoutBtn,ThemeToggle} from '../index'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus=useSelector((state)=>state.auth.status)
  const navigate=useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

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
          ? 'border-b border-border/50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md shadow-sm' 
          : 'border-b border-transparent bg-surface dark:bg-[#0F172A]'
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
                      className={`inline-block px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        pathname === item.slug
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm shadow-primary-500/10'
                          : 'text-text-secondary hover:bg-slate-100/80 dark:hover:bg-surface-dark/50 hover:text-text-primary'
                      }`}
                    >
                      {item.name}
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
                 className="p-2 -mr-2 text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-surface-dark/50 rounded-lg transition-colors"
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
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        pathname === item.slug
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                          : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-surface-dark/50 hover:text-text-primary'
                      }`}
                    >
                      {item.name}
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