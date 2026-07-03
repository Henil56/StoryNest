import React from 'react'

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-300"></div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-lg text-text-muted max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}
