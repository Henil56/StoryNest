import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Logo from '../Logo'

function Footer() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)

  const linkStyle = "inline-block text-sm text-white/70 dark:text-slate-400 hover:text-white dark:hover:text-primary-300 transition-all duration-200 hover:translate-x-1"

  return (
    <footer className="bg-[#17304D] dark:bg-[#0F172A] mt-20 border-t border-primary-500/20 dark:border-white/5 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 dark:bg-primary-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-7xl px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo size="small" variant="dark" />
            </div>
            <p className="text-white/70 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Create. Read. Inspire.<br/>
              Your home for sharing stories that matter.
            </p>
            <div className="flex gap-4 mt-8">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-surface-dark-secondary flex items-center justify-center text-white/70 dark:text-slate-400 hover:text-white hover:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/20" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>

              <a href="https://www.linkedin.com/in/henil-kukadiya" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-surface-dark-secondary flex items-center justify-center text-white/70 dark:text-slate-400 hover:text-white hover:bg-[#0077b5] dark:hover:bg-[#0077b5] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0077b5]/20" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-slate-300 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li><Link className={linkStyle} to="/">Home</Link></li>
              <li><Link className={linkStyle} to="/all-post">Explore</Link></li>
              {authStatus ? (
                <>
                  <li><Link className={linkStyle} to="/add-post">Write a Story</Link></li>
                  <li><Link className={linkStyle} to={`/author/${userData?.$id}`}>Your Profile</Link></li>
                </>
              ) : (
                <li><Link className={linkStyle} to="/login">Login / Sign up</Link></li>
              )}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-slate-300 mb-6">
              Connect
            </h3>
            <ul className="space-y-4">
              <li><a className={linkStyle} href="https://github.com/Henil56/StoryNest" target="_blank" rel="noreferrer">GitHub</a></li>
              <li><a className={linkStyle} href="https://www.linkedin.com/in/henil-kukadiya" target="_blank" rel="noreferrer">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white dark:text-slate-300 mb-6">
              Legal
            </h3>
            <ul className="space-y-4">
              <li><Link className={linkStyle} to="/terms">Terms & Conditions</Link></li>
              <li><Link className={linkStyle} to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50 dark:text-slate-500">
            &copy; {new Date().getFullYear()} StoryNest. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-white/50 dark:text-slate-500">
            Built with 
            <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer