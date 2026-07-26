import React from 'react'

export default function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 border-primary-200/50 dark:border-primary-700/30',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-700/30',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-700/30',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200/50 dark:border-rose-700/30',
    neutral: 'bg-primary-50 text-primary-800 dark:bg-slate-800 dark:text-slate-300 border-primary-200/30 dark:border-slate-600/30',
  }

  const dotColors = {
    primary: 'bg-primary-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  }

  const variantClasses = variants[variant] || variants.primary
  const dotColor = dotColors[variant] || dotColors.primary

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border transition-transform duration-200 hover:scale-105 ${variantClasses} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {children}
    </span>
  )
}
