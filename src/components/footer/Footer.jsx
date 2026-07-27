import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '../Logo'

function Footer() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)

  const linkStyle = "group/link flex items-center gap-2 text-sm text-[#2E4A62] dark:text-slate-300/80 hover:text-[#0D1B2A] dark:hover:text-pink-300 transition-all duration-300 hover:translate-x-1.5"

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-[#EAF4FB] via-[#DAEDF8] to-[#C8E4F5] dark:from-[#0c0418] dark:via-[#07020d] dark:to-[#050109] border-t border-[#A8D4EE] dark:border-white/10 overflow-hidden">
      {/* Top Animated Gradient Rim */}
      <div 
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#4682B4]/50 dark:via-pink-500/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-24 left-1/4 w-[600px] h-[350px] bg-sky-400/25 dark:bg-pink-600/15 blur-[130px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-blue-500/15 dark:bg-purple-800/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="mb-4 inline-block">
                <Logo width="220px" variant="auto" className="h-auto object-contain" />
              </div>
              <p className="text-[#2E4A62] dark:text-slate-400 text-sm leading-relaxed max-w-sm mt-2">
                Create. Read. Inspire.<br />
                Your sanctuary for reading, writing, and sharing stories that resonate with the world.
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-8">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#2E4A62] dark:text-slate-400 mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                <a 
                  href="https://github.com/Henil56/StoryNest" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/70 border border-[#A8D4EE] backdrop-blur-md flex items-center justify-center text-[#2E4A62] hover:text-[#0D1B2A] hover:bg-white hover:border-[#4682B4] hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/20 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/15 dark:hover:border-white/30 transition-all duration-300" 
                  aria-label="GitHub Repository"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>

                <a 
                  href="https://www.linkedin.com/in/henil-kukadiya" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-white/70 border border-[#A8D4EE] backdrop-blur-md flex items-center justify-center text-[#2E4A62] hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0077b5]/40 dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-[#0077b5]/80 transition-all duration-300" 
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#17304D] dark:text-pink-300/90 mb-5">
              Navigation
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <Link className={linkStyle} to="/">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  Home
                </Link>
              </li>
              <li>
                <Link className={linkStyle} to="/all-post">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  Explore Posts
                </Link>
              </li>
              {authStatus ? (
                <>
                  <li>
                    <Link className={linkStyle} to="/add-post">
                      <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      Write Story
                    </Link>
                  </li>
                  <li>
                    <Link className={linkStyle} to={`/author/${userData?.$id}`}>
                      <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      Profile Page
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link className={linkStyle} to="/login">
                    <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    Sign In / Register
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Connect Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#17304D] dark:text-pink-300/90 mb-5">
              Connect
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <a className={linkStyle} href="https://github.com/Henil56/StoryNest" target="_blank" rel="noreferrer">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  GitHub Project
                </a>
              </li>
              <li>
                <a className={linkStyle} href="https://www.linkedin.com/in/henil-kukadiya" target="_blank" rel="noreferrer">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#17304D] dark:text-pink-300/90 mb-5">
              Legal
            </h3>
            <ul className="space-y-3 list-none p-0 m-0">
              <li>
                <Link className={linkStyle} to="/terms">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className={linkStyle} to="/privacy">
                  <svg className="w-3.5 h-3.5 text-[#4682B4] dark:text-pink-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-[#A8D4EE]/60 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5B8AAD] dark:text-slate-400">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-[#17304D] dark:text-slate-200">StoryNest</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#5B8AAD] dark:text-slate-400">
            <span>Crafted with</span>
            <svg className="w-4 h-4 text-rose-500 animate-pulse inline-block" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>for storytellers & readers everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer