import React from 'react'

export default function EmptyState({ title, description, icon = '📚', action }) {
  return (
    <div className="relative rounded-2xl border border-border/50 bg-surface-elevated/80 backdrop-blur-sm py-20 text-center animate-fade-in overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>
      
      <div className="relative z-10">
        <div className="text-6xl mb-5 animate-float" role="img" aria-hidden="true">{icon}</div>
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        {description && <p className="mt-3 text-text-muted max-w-md mx-auto leading-relaxed">{description}</p>}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}
