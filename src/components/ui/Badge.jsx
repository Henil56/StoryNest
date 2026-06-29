import React from 'react'

export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ${className}`}>
      {children}
    </span>
  )
}
