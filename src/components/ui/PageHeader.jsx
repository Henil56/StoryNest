import React from 'react'

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="h-1.5 w-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-300"
          style={{ animation: 'accent-bar-grow 0.6s ease-out 0.2s forwards' }}
        ></div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text-light">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-lg text-text-muted max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}
