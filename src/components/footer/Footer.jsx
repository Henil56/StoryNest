import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="bg-[#17304D] dark:bg-[#0F172A] mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
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
            <div className="flex gap-4 mt-6">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-surface-dark-secondary flex items-center justify-center text-white/70 dark:text-slate-400 hover:text-white hover:bg-primary-500 dark:hover:bg-primary-600 transition-all duration-200" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>

              <a href="https://www.linkedin.com/in/henil-kukadiya" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-surface-dark-secondary flex items-center justify-center text-white/70 dark:text-slate-400 hover:text-white hover:bg-[#0077b5] dark:hover:bg-[#0077b5] transition-all duration-200" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-200 dark:text-slate-400 mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/">Home</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/all-post">Explore</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/add-post">Write</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/resources">Resources</Link></li>
            </ul>
          </div>

          {/* More */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-200 dark:text-slate-400 mb-5">
              More
            </h3>
            <ul className="space-y-3">
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/privacy">Privacy</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/terms">Terms</Link></li>
              <li><a className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-200 dark:text-slate-400 mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="text-sm text-white/80 dark:text-slate-300 hover:text-white transition-colors duration-200" to="/terms">Licensing</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 dark:border-slate-800">
          <p className="text-sm text-white/50 dark:text-slate-500 text-center">
            &copy; {new Date().getFullYear()} StoryNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer